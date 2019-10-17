import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Contact} from "../model/contact.model";
import {EventInfo} from "../model/eventinfo.model";
import {TopicNode} from "../model/topicnode.model";
import {Storage} from "@ionic/storage";
import {TopicGroup} from "../model/topicgroup.model";

var SUBSCRIPTIONS_KEY: string = "MY_SUBSCRIPTIONS";

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    private URL_PREFIX = "http://localhost:4200/rest";


    private loaded: boolean = false;
    private currentSubscriptions = new Map<string, TopicGroup>();

    constructor(private http: HttpClient, private storage: Storage) {
        this.loadCurrentSubscriptionsFromLocalStorage();
    }

    public updateUrlPrefix(url : string) {
        this.URL_PREFIX = url;
    }

    public getCurrentUrlPrefix(): string {
        return this.URL_PREFIX;
    }

    public getAllContacts(): Observable<Contact> {
        return this.http.get<Contact>(`${this.URL_PREFIX}/contacts`);
    }

    public getEventInfo(eventId: string): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}/events/${eventId}`);
    }

    public getOfficeHours(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}/events/officeHours`);
    }

    public getMassSchedule(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}/events/massSchedule`);
    }

    public getConfessionSchedule(): Observable<EventInfo> {
        return this.http.get<EventInfo>(`${this.URL_PREFIX}/events/confession`);
    }

    public getAllAvailableTopics(): Observable<TopicNode[]> {
        return this.http.get<TopicNode[]>(`${this.URL_PREFIX}/notifications/topics/`);
    }

    public addNewTopic(topic: TopicNode): Observable<boolean> {
        return this.http.post<boolean>(`${this.URL_PREFIX}/notifications/topics/`, topic);
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

    public getCurrentSubscriptions(): Map<string, TopicGroup> {
        return this.currentSubscriptions;
    }

    private loadCurrentSubscriptionsFromLocalStorage() {
        from(Promise.resolve(this.storage.get(SUBSCRIPTIONS_KEY))).subscribe(
        topicGroups => {
                if (topicGroups == null)
                    return;
                for (let group of <TopicGroup[]>topicGroups) {
                    this.currentSubscriptions.set(group.id, group);
                }
                this.loaded = true;
            },
        error => {
                this.loaded = true;
            })
    }

    public saveCurrentSubscriptions(topicGroups: Map<String, TopicGroup>) {
        let data: TopicGroup[] = [];
        topicGroups.forEach((group, idKey, m) => {
            data.push(group);
        });
        this.storage.set(SUBSCRIPTIONS_KEY, data);
    }
}
