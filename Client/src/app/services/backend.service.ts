import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Contact} from '../model/contact.model';
import {EventInfo} from '../model/eventinfo.model';
import {TopicNode} from '../model/topicnode.model';
import {Storage} from '@ionic/storage';
import {TopicGroup} from '../model/topicgroup.model';
import {NGXLogger} from 'ngx-logger';
import {MyUser} from '../model/MyUser.model';
import {MyNotification} from '../model/fcmnotification.model';

const LAST_SYNC_TIME_KEY = 'LAST_SYNC_TIME';
const SUBSCRIPTIONS_KEY = 'MY_SUBSCRIPTIONS';
const URL_PREFIX_KEY = 'URL_PREFIX';
const AVAILABLE_URL_PREFIXS: string[]  = ['http://localhost:4200', 'http://192.168.10.11:8080', 'http://69.221.129.172:8080'];


@Injectable({
    providedIn: 'root'
})
export class BackendService {
    private URL_PREFIX: string;
    private myAuthorizedUser: MyUser;
    private timerHandler: any;
    private minutesLeft = 0;
    private countDownHandler: any;

    constructor(private logger: NGXLogger, private http: HttpClient, private storage: Storage) {
    }

    public authorizeUser(userEmail: string, idToken: any): Observable<any> {
        return this.http.post(`${this.URL_PREFIX}/rest/contacts/${userEmail}/authorization`, idToken);
    }

    public updateUrlPrefix(url: string) {
        this.URL_PREFIX = url;
    }

    public getMinutesLeft(): number {
        return this.minutesLeft;
    }

    public setAuthorizedUser(myAuthorizedUser: MyUser) {
        if (this.timerHandler) {
            clearInterval(this.timerHandler);
        }

        this.myAuthorizedUser = myAuthorizedUser;
        if (this.myAuthorizedUser) {
            const expTime = this.myAuthorizedUser.getExpireTime();
            const timeLeft = (expTime) ? expTime - (Date.now() / 1000) : -1;
            if (timeLeft > 0) {
                this.logger.info(`Token for user ${this.myAuthorizedUser.userEmail} will expire in ${timeLeft} seconds.`);
                this.minutesLeft = Math.floor(timeLeft / 60);
                this.countDownHandler = setInterval(() => {
                    if (this.minutesLeft <= 0) {
                        clearInterval(this.countDownHandler);
                        return;
                    }
                    this.logger.info(`Counting down to token expire time ${this.minutesLeft}`);
                    this.minutesLeft = this.minutesLeft - 1;
                }, 60 * 1000);

                this.timerHandler = setInterval(() => {
                    this.logger.info(`Token for user ${this.myAuthorizedUser.userEmail} has just expired. Logout`);
                    this.setAuthorizedUser(null);
                }, timeLeft * 1000);
            } else {
                this.logger.info(`Token for user ${this.myAuthorizedUser.userEmail} expired already.`);
                this.myAuthorizedUser = null;
            }
        }
    }

    public getAuthorizedUser(): MyUser {
        return this.myAuthorizedUser;
    }

    public getCurrentUrlPrefix(): string {
        return this.URL_PREFIX;
    }

    public getAvailableUrlPrefixes(): string[] {
        return AVAILABLE_URL_PREFIXS;
    }

    public async pickAvailableUrl(): Promise<string> {
        this.logger.debug(`need to pick an available URL...`);
        for (const url of AVAILABLE_URL_PREFIXS) {
            try {
                this.logger.debug(`checking...${url}`);
                const result = await this.http.get<any>(`${url}/actuator/health`).toPromise();
                if (result != null) {
                    return url;
                }
            } catch (ex) {
                this.logger.debug(`${ex}`);
            }
        }
    }

    public getAllContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(`${this.URL_PREFIX}/rest/contacts/`);
    }

    public upsertContact(contact: Contact): Observable<boolean> {
        return this.http.post<boolean>(`${this.URL_PREFIX}/rest/contacts/`, contact);
    }

    public getEventInfo(eventId: string): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}/rest/events/${eventId}`);
    }

    public getOfficeHours(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}/rest/events/officeHours`);
    }

    public getMassSchedule(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}/rest/events/massSchedule`);
    }

    public getConfessionSchedule(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}/rest/events/confession`);
    }

    public getAllAvailableTopics(): Observable<TopicNode[]> {
        return this.http.get<TopicNode[]>(`${this.URL_PREFIX}/rest/notifications/topics/`);
    }

    public addNewTopic(topic: TopicNode): Observable<boolean> {
        return this.http.post<boolean>(`${this.URL_PREFIX}/rest/notifications/topics/`, topic);
    }

    public buildTopicGroups(topics: TopicNode[]): Map<string, TopicGroup> {
        const topicGroups = new Map<string, TopicGroup>();
        for (const topic of topics) {
            if (!topic.parentId) {
                topicGroups.set(topic.id,
                    {
                        id: topic.id,
                        expanded: false,
                        englishName: topic.englishName,
                        vietnameseName: topic.vietnameseName,
                        subtopics: []
                    });
            }
        }
        return topicGroups;
    }

    public buildSubTopics(topicGroups: Map<string, TopicGroup>, topics: TopicNode[]) {
        for (const topic of topics) {
            if (topic.parentId && topicGroups.has(topic.parentId)) {
                topicGroups.get(topic.parentId).subtopics.push(topic);
            }
        }
    }

    public getAllAvailableTopicGroups(): Observable<TopicGroup[]> {
        return this.http.get<TopicGroup[]>(`${this.URL_PREFIX}/rest/notifications/topicGroups/`);
    }

    public sendNotification(topic: TopicNode, title: string, body: string): Observable<string> {
        const msg = {
            'title': title,
            'body': body,
            'data': {
            }
        };
        return this.http.put<string>(`${this.URL_PREFIX}/rest/notifications/topics/${topic.id}/messages`, msg);
    }

    public retrieveNotificationsSinceLastSync(topics: string, status: string, lastSyncTime: number): Observable<MyNotification[]> {
        // topics: comma separated topicIds
        return this.http.get<MyNotification[]>(
            `${this.URL_PREFIX}/rest/notifications/messages?sentTime=${lastSyncTime}&status=${status}&topics=${topics}`);
    }

    public async getSubscribedToTopics(): Promise<TopicNode[]> {
        const ret: TopicNode[] = [];
        (await this.loadCurrentSubscriptionsFromLocalStorage()).forEach(group => {
            if (group.subtopics == null) {
                return;
            }
            group.subtopics.forEach(topic => {
                if (topic.subscribed) {
                    ret.push(topic);
                }
            });
        });
        return ret;
    }

    public loadCurrentSubscriptionsFromLocalStorage(): Promise<TopicGroup[]> {
        return this.storage.get(SUBSCRIPTIONS_KEY);
    }

    public async saveCurrentSubscriptions(topicGroups: Map<string, TopicGroup>) {
        const data: TopicGroup[] = [];
        topicGroups.forEach((group, idKey, m) => {
            data.push(group);
        });
        await this.storage.set(SUBSCRIPTIONS_KEY, data);
    }

    public async saveSyncTime(syncTime: number) {
        syncTime = syncTime == null ? Date.now() : syncTime;
        await this.storage.set(LAST_SYNC_TIME_KEY, syncTime);
        return syncTime;
    }

    public async getLastSyncTime(): Promise<number> {
        const lastSyncTime = await this.storage.get(LAST_SYNC_TIME_KEY);
        return lastSyncTime ? lastSyncTime : 0;
    }

    public clearStorage() {
        this.storage.clear().then(() => {
            this.logger.debug(`Finished clearing this.storage`);
        });
    }


}
