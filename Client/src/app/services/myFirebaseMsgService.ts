import {Injectable} from '@angular/core';
import {Firebase} from '@ionic-native/firebase/ngx';
import {Observable} from 'rxjs';

import {Storage} from '@ionic/storage';
import {MyNotification} from '../model/fcmnotification.model';
import {NGXLogger} from "ngx-logger";

@Injectable({
    providedIn: 'root'
})
export class MyFirebaseMsgService {
    /*
     * notifications are organized into arrays by Date (notime)
     * and stored in storage under key NOTIFICATION_PREFIX + (new Date(notifcation.creationTime).toDateString())
     */

    public static NOTIFICATION_PREFIX: string = 'notifications-';
    public static MILLIS_PER_DAY: number = 1000*60*60*24;
    private currentToken: string = null;

    constructor(private logger: NGXLogger,
                private firebase: Firebase,
                private storage: Storage) {
        this.setup();
    }

    private setup() {
        this.logger.debug('calling fcmService setup ');
        this.firebase.onTokenRefresh().subscribe(newToken => {
            this.logger.debug('got token ' + newToken);
        });
        this.firebase.onNotificationOpen().subscribe((msg: MyNotification) => {
            this.logger.info(`got msg inside MyFirebaseMsgService ${JSON.stringify(msg)}`);
            this.saveNotification(msg);
        });
    }

    public getCurrentToken() {
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


    public async getKeys() {
        return await this.storage.keys();
    }

    public getSavedNotifications(from?: number, to?: number): Observable<Map<number, MyNotification[]>> {
        return new Observable(observer => {
            this.getNotificationKeys(from, to).then(keys => {
                for (let keyForDate of keys) {
                    this.storage.get(keyForDate).then((prevNotifications: MyNotification[]) => {
                        if (prevNotifications == null || prevNotifications.length == 0) {
                            return;
                        }
                        let ret: Map<number, MyNotification[]> = new Map<number, MyNotification[]>();
                        ret.set(MyFirebaseMsgService.extractTimeFromNotificationKey(keyForDate), prevNotifications);
                        observer.next(ret);
                    });
                }
            })
            return {
                unsubscribe() {
                }
            };
        });
    }

    public async getNotificationKeys(from?: number, to?: number): Promise<string[]> {
        let fromTime: number = Math.min(from == null ? 0 : from, to == null ? Date.now() : to);
        let fromKey: string = MyFirebaseMsgService.buildNotificationKey(fromTime);
        let toKey: string = MyFirebaseMsgService.buildNotificationKey(Math.max(fromTime, to == null ? Date.now() : to));

        let keys = await this.storage.keys();
        keys.sort();

        let ret: string[] = [];
        for (let key of keys) {
            if (MyFirebaseMsgService.isNotificationKey(key) && fromKey <= key && key <= toKey) {
                ret.push(key);
            }
        }
        return ret;
    }

    public async saveNotification(msg: MyNotification) {
        if (msg.creationTime == null)
            msg.creationTime= Date.now();

        // var creationDate = new Date(Number(msg.creationTime));
        var keyForDate = MyFirebaseMsgService.buildNotificationKey(msg.creationTime);
        this.logger.debug(`saveNotification title [${msg.title}] creationTime [${msg.creationTime}] creationTimeType ${typeof msg.creationTime} keyForDate [${keyForDate}]`);
        var prevNotifications: MyNotification[] = await this.storage.get(keyForDate);

        if (prevNotifications == null) {
            prevNotifications = []
        }
        prevNotifications.push(msg);

        let ret = await this.storage.set(keyForDate, prevNotifications);
        return ret;
    }

    public async deleteNotification(msg: MyNotification) {
        if (msg.creationTime == null)
            return true;

        let keyForDate = MyFirebaseMsgService.buildNotificationKey(msg.creationTime);
        this.logger.debug(`Find notifications for keyForDate ${keyForDate}`);

        let prevNotifications: MyNotification[] = await this.storage.get(keyForDate);

        if (prevNotifications == null || prevNotifications.length == 0) {
            this.logger.debug(`Notifications for keyForDate ${keyForDate} is null or empty`);
            return true;
        }

        this.logger.debug(`Notifications for keyForDate ${keyForDate} count is ${prevNotifications.length}`);
        let found: boolean = false;
        for (let index = prevNotifications.length - 1; 0 <= index; index--) {
            this.logger.debug(`Checking on item ${JSON.stringify(prevNotifications[index])}`);
            if (msg.topic != prevNotifications[index].topic ||
                msg.creationTime != prevNotifications[index].creationTime ||
                msg.title != prevNotifications[index].title)
                continue;

            this.logger.debug(`Item ${JSON.stringify(prevNotifications[index])} is a match and will be deleted`);
            prevNotifications.splice(index, 1);
            found = true;
        }
        if (!found)
            return true;
        this.logger.debug(`Store the prevNotifications back in storage`);
        return this.storage.set(keyForDate, prevNotifications);
    }

    private static isNotificationKey(key: string): boolean {
        return key == null ? false : key.startsWith(MyFirebaseMsgService.NOTIFICATION_PREFIX);
    }

    private static extractTimeFromNotificationKey(key: string): number {
        return key == null ? 0 : key.startsWith(MyFirebaseMsgService.NOTIFICATION_PREFIX) ? Number(key.replace(MyFirebaseMsgService.NOTIFICATION_PREFIX, "")) : 0;
    }

    private static buildNotificationKey(shouldBeANumber: any): string {
        let date = new Date(Number(shouldBeANumber));
        return MyFirebaseMsgService.NOTIFICATION_PREFIX + `${Math.max(0, Date.parse(date.toDateString()))}`.padStart(15, "0");
    }
}
