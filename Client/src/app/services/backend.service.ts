import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Contact} from "../model/contact.model";
import {EventInfo} from "../model/eventinfo.model";
import {TopicNode} from "../model/topicnode.model";
import {Storage} from "@ionic/storage";
import {TopicGroup} from "../model/topicgroup.model";
import {NGXLogger} from "ngx-logger";

var SUBSCRIPTIONS_KEY: string = "MY_SUBSCRIPTIONS";
var URL_PREFIX_KEY: string = "URL_PREFIX";
var AVAILABLE_URL_PREFIXS: string[]  = ["http://localhost:4200", "http://192.168.10.11:8080", "http://69.221.129.172:8080"];


@Injectable({
    providedIn: 'root'
})
export class BackendService {

    private URL_PREFIX: string;


    private loaded: boolean = false;
    private currentSubscriptions = new Map<string, TopicGroup>();

    constructor(private logger: NGXLogger, private http: HttpClient, private storage: Storage) {
    }

    public authorizeUser(userEmail:string, idToken: any): Observable<any> {
        return this.http.post(`${this.URL_PREFIX}/rest/users/${userEmail}/authorization`, idToken);
    }

    public updateUrlPrefix(url : string) {
        this.URL_PREFIX = url;
    }

    public getCurrentUrlPrefix(): string {
        return this.URL_PREFIX;
    }

    public getAvailableUrlPrefixes(): string[] {
        return AVAILABLE_URL_PREFIXS;
    }

    public async pickAvailableUrl(): Promise<string> {
        this.logger.debug("need to pick an available URL...");
        for (let url of AVAILABLE_URL_PREFIXS) {
            try {
                this.logger.debug(`checking...${url}`);
                let result = await this.http.get<any>(`${url}/actuator/health`).toPromise();
                if (result != null) {
                    return url;
                }
            } catch (ex) {
                this.logger.debug(`${ex}`)
            }
        }
    }

    public getAllContacts(): Observable<Contact> {
        return this.http.get<Contact>(`${this.URL_PREFIX}/rest/contacts/`);
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
        var topicGroups = new Map<string, TopicGroup>();
        for (let topic of topics) {
            if (!topic.parentId) {
                topicGroups.set(topic.id, {id: topic.id, expanded: false, englishName: topic.englishName, vietnameseName: topic.vietnameseName, subtopics: []});
            }
        }
        return topicGroups;
    }

    public buildSubTopics(topicGroups: Map<string, TopicGroup>, topics: TopicNode[]) {
        for (let topic of topics) {
            if (topic.parentId && topicGroups.has(topic.parentId)) {
                topicGroups.get(topic.parentId).subtopics.push(topic);
            }
        }
    }

    public sendNotification(topic: TopicNode, title: string, body: string):Observable<string> {
        let msg = {
            'title': title,
            'body': body,
            'data':{
            }
        };
        return this.http.put<string>(`${this.URL_PREFIX}/rest/notifications/topics/${topic.id}/messages`, msg);
    }

    public loadCurrentSubscriptionsFromLocalStorage(): Observable<TopicGroup[]> {
        return from(Promise.resolve(this.storage.get(SUBSCRIPTIONS_KEY)));
    }

    public saveCurrentSubscriptions(topicGroups: Map<String, TopicGroup>) {
        let data: TopicGroup[] = [];
        topicGroups.forEach((group, idKey, m) => {
            data.push(group);
        });
        this.storage.set(SUBSCRIPTIONS_KEY, data);
    }

    public clearStorage() {
        this.storage.clear().then(() => {
            this.logger.debug("Finished clearing this.storage");
        });
    }


}
