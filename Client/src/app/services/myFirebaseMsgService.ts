import {Injectable} from '@angular/core';
import {Firebase} from '@ionic-native/firebase/ngx';
import {Storage} from '@ionic/storage';
import {Observable, Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';

import {MyNotification} from '../model/fcmnotification.model';
import {BackendService} from './backend.service';


@Injectable({
    providedIn: 'root'
})
export class MyFirebaseMsgService {
    /*
     * notifications are organized into arrays by Date (notime)
     * and stored in storage under key NOTIFICATION_PREFIX + (new Date(notifcation.creationTime).toDateString())
     */

    public static NOTIFICATION_PREFIX = 'notifications-';
    public static MILLIS_PER_DAY: number = 1000 * 60 * 60 * 24;
    private currentToken: string = null;
    private newNotificationSubject: Subject<MyNotification[]> = new Subject<MyNotification[]>();

    private static isNotificationKey(key: string): boolean {
        return key == null ? false : key.startsWith(MyFirebaseMsgService.NOTIFICATION_PREFIX);
    }

    private static extractTimeFromNotificationKey(key: string): number {
        return key == null ? 0 :
            key.startsWith(MyFirebaseMsgService.NOTIFICATION_PREFIX) ?
                Number(key.replace(MyFirebaseMsgService.NOTIFICATION_PREFIX, '')) : 0;
    }

    private static buildNotificationKey(shouldBeANumber: any): string {
        const date = new Date(Number(shouldBeANumber));
        return MyFirebaseMsgService.NOTIFICATION_PREFIX + `${Math.max(0, Date.parse(date.toDateString()))}`.padStart(15, '0');
    }

    constructor(private logger: NGXLogger,
                private firebase: Firebase,
                private storage: Storage,
                private backendService: BackendService) {
        this.setup();
    }

    private setup() {
        this.logger.debug('calling fcmService setup ');
        this.firebase.onTokenRefresh().subscribe(newToken => {
            this.logger.debug('got token ' + newToken);
        });

        this.firebase.onNotificationOpen().subscribe(async (msg: MyNotification) => {
            this.logger.info(`got msg inside MyFirebaseMsgService ${JSON.stringify(msg)}`);
            if (msg.tap) {
                const clearResult = await this.firebase.clearAllNotifications();
                this.logger.info(`got clearAllNotifications result MyFirebaseMsgService ${JSON.stringify(clearResult)}`);
                const topicIds =
                    (await this.backendService.getSubscribedToTopics()).
                    map((value, index, array) => value.id).join(',');
                this.logger.info(`got topicIds ${topicIds}`);
                const lastSyncTime = await this.backendService.getLastSyncTime();
                this.logger.info(`last sync time ${lastSyncTime}`);
                this.backendService.retrieveNotificationsSinceLastSync(topicIds, 'PROCESSED_SUCCESSFULLY', lastSyncTime).
                    subscribe(async otherNotifications => {
                        await this.saveNotification(otherNotifications);
                        await this.backendService.saveSyncTime(null);
                        this.newNotificationSubject.next(otherNotifications);
                    },
                    (error) => {
                        this.logger.info(`error when retrieveNotificationsSinceLastSync  ${JSON.stringify(error)}`);
                    });
            } else {
                const otherNotifications: MyNotification[] = [msg];
                await this.saveNotification(otherNotifications);
                this.newNotificationSubject.next(otherNotifications);
            }
        });
    }

    public onNotificationOpen(): Subject<MyNotification[]> {
        return this.newNotificationSubject;
    }

    public getCurrentToken(): string {
        return this.currentToken;
    }

    public subscribeToTopic(topic: string) {
        this.firebase.subscribe(topic).then(good => {
                this.logger.debug(`subscribeToTopic ${topic} : ${good}`);
            },
            bad => {
                this.logger.debug(`subscribeToTopic ${topic} : ${bad}`);
            });
    }

    public unsubscribeFromTopic(topic: string) {
        this.firebase.unsubscribe(topic).then(good => {
                this.logger.debug(`unsubscribeFromTopic ${topic} : ${good}`);
            },
            bad => {
                this.logger.debug(`unsubscribeFromTopic ${topic}: ${bad}`);
            });
    }


    public async getKeys(): Promise<string[]> {
        return await this.storage.keys();
    }

    public getSavedNotifications(from?: number, to?: number): Observable<Map<number, MyNotification[]>> {
        return new Observable(subscriber => {
            this.getNotificationKeys(from, to).then(keys => {
                if (keys.length === 0) {
                    subscriber.next(new Map<number, MyNotification[]>());
                } else {
                    for (const keyForDate of keys) {
                        this.logger.debug(`getSavedNotifications working on key ${keyForDate}`);
                        this.storage.get(keyForDate).then((prevNotifications: MyNotification[]) => {
                            const ret: Map<number, MyNotification[]> = new Map<number, MyNotification[]>();
                            if (prevNotifications  && prevNotifications.length > 0) {
                                ret.set(MyFirebaseMsgService.extractTimeFromNotificationKey(keyForDate), prevNotifications);
                            }
                            subscriber.next(ret);
                        },
                        (rejectedReason) => {
                            this.logger.warn(`getSavedNotifications get values for key ${keyForDate} was rejected.`,
                                JSON.stringify(rejectedReason));
                            subscriber.complete();
                        });
                    }
                }
                return;
            },
            (rejectedReason) => {
                this.logger.warn(`getSavedNotifications getNotificationKeys from ${from} to ${to} was rejected.`,
                    JSON.stringify(rejectedReason));
                subscriber.complete();
            });
        });
    }

    public async getNotificationKeys(from?: number, to?: number): Promise<string[]> {
        const fromTime: number = Math.min(from == null ? 0 : from, to == null ? Date.now() : to);
        const fromKey: string = MyFirebaseMsgService.buildNotificationKey(fromTime);
        const toKey: string = MyFirebaseMsgService.buildNotificationKey(Math.max(fromTime, to == null ? Date.now() : to));

        const keys = await this.storage.keys();
        keys.sort();

        const ret: string[] = [];
        for (const key of keys) {
            if (MyFirebaseMsgService.isNotificationKey(key) && fromKey <= key && key <= toKey) {
                ret.push(key);
            }
        }
        return ret;
    }

    public async saveNotification(messages: MyNotification[]): Promise<MyNotification[]> {
        const msgGroups = new Map<string, MyNotification[]>();
        for (const msg of messages) {
            if (msg.creationTime == null) {
                msg.creationTime = Date.now();
            }

            // var creationDate = new Date(Number(msg.creationTime));
            const keyForDate = MyFirebaseMsgService.buildNotificationKey(msg.creationTime);
            this.logger.debug(`saveNotification` +
                ` title [${msg.title}]` +
                ` creationTime [${msg.creationTime}]` +
                ` creationTimeType [${typeof msg.creationTime}]` +
                ` keyForDate [${keyForDate}]`);

            let msgs: MyNotification[] = msgGroups.get(keyForDate);
            if (msgs == null) {
                msgs = [];
            }
            msgs.push(msg);
            msgGroups.set(keyForDate, msgs);
        }

        msgGroups.forEach(async (msgs, keyForDate, map) => {
            this.logger.debug(`working on key ${keyForDate} new msg count ${msgs.length}`);
            let prevNotifications: MyNotification[] = await this.storage.get(keyForDate);
            if (prevNotifications == null) {
                prevNotifications = [];
            }
            this.logger.debug(`prevNotifications count before concat ${prevNotifications.length}`);
            prevNotifications = prevNotifications.concat(msgs);
            prevNotifications.sort((a, b) => b.creationTime - a.creationTime);
            this.logger.debug(`prevNotifications count after concat and sort ${prevNotifications.length}`);
            await this.storage.set(keyForDate, this.cleanupSortedDuplicatedNotifications(prevNotifications));
        });

        return messages;
    }

    private cleanupSortedDuplicatedNotifications(prevNotifications: MyNotification[]): MyNotification[] {
        this.logger.debug(`prevNotifications before cleaning up count ${prevNotifications.length}`);
        let msg: MyNotification = null;
        for (let index = prevNotifications.length - 1; 0 <= index; index--) {
            this.logger.debug(`Checking on item ${JSON.stringify(prevNotifications[index])}`);
            if (msg == null ||
                    msg.topic !== prevNotifications[index].topic ||
                    msg.creationTime !== prevNotifications[index].creationTime ||
                    msg.title !== prevNotifications[index].title) {
                msg = prevNotifications[index];
                continue;
            }

            this.logger.debug(`Item ${JSON.stringify(prevNotifications[index])} is a match and will be deleted`);
            prevNotifications.splice(index, 1);
        }
        this.logger.debug(`prevNotifications after cleaning up count ${prevNotifications.length}`);
        return prevNotifications;
    }

    private removeDuplicatedNotification(prevNotifications: MyNotification[], msg: MyNotification): boolean {
        let found = false;
        for (let index = prevNotifications.length - 1; 0 <= index; index--) {
            this.logger.debug(`Checking on item ${JSON.stringify(prevNotifications[index])}`);
            if (msg.topic !== prevNotifications[index].topic ||
                msg.creationTime !== prevNotifications[index].creationTime ||
                msg.title !== prevNotifications[index].title) {
                continue;
            }

            this.logger.debug(`Item ${JSON.stringify(prevNotifications[index])} is a match and will be deleted`);
            prevNotifications.splice(index, 1);
            found = true;
        }
        return found;
    }

    public async deleteNotification(msg: MyNotification) {
        if (msg.creationTime == null) {
            return true;
        }

        const keyForDate = MyFirebaseMsgService.buildNotificationKey(msg.creationTime);
        this.logger.debug(`Find notifications for keyForDate ${keyForDate}`);

        const prevNotifications: MyNotification[] = await this.storage.get(keyForDate);

        if (prevNotifications == null || prevNotifications.length === 0) {
            this.logger.debug(`Notifications for keyForDate ${keyForDate} is null or empty`);
            return true;
        }

        this.logger.debug(`Notifications for keyForDate ${keyForDate} count is ${prevNotifications.length}`);
        if (!this.removeDuplicatedNotification(prevNotifications, msg)) {
            return true;
        }
        this.logger.debug(`Store the prevNotifications back in storage`);
        return await this.storage.set(keyForDate, prevNotifications);
    }

}
