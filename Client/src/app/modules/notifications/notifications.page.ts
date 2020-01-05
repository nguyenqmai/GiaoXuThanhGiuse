import {Component, OnInit} from '@angular/core';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {MyNotification} from '../../model/fcmnotification.model';
import {NGXLogger} from "ngx-logger";

// import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notifications',
    templateUrl: 'notifications.page.html',
    styleUrls: ['notifications.page.scss']
})


export class NotificationsPage implements OnInit {
    groupExpansionControl: Map<number, boolean> = new Map<number, boolean>();
    fcmNotifications: Map<number, MyNotification[]> = new Map<number, MyNotification[]>();
    refreshCount: number = 0;
    waiting: boolean = false;

    constructor(private logger: NGXLogger, private fcm: MyFirebaseMsgService) {
    }

    ngOnInit() {
        this.refreshAllNotifications();
        this.fcm.onNotificationOpen().subscribe(data => {
            this.logger.info(`got msg inside NotificationsPage ${JSON.stringify(data)}`);
            this.refreshAllNotifications();
        });
    }

    doRefresh(event) {
        console.log('Begin async operation');
        this.refreshAllNotifications();
        setTimeout(() => {
            console.log('Async operation has ended');
            this.refreshCount += 1;
            event.target.complete();
        }, 1000);
    }

    public getAllNotificationKeys(): number[] {
        return Array.from(this.fcmNotifications.keys()).sort().reverse();
    }

    public getNotificationsOfKey(key: number): MyNotification[] {
        return this.fcmNotifications.get(key);
    }

    public insertRandomNotification() {
        let millis = Date.now();
        let notification = {
            key: 'key-' + millis,
            creationTime: millis,
            tap: false,
            topic: 'topic-' + millis,
            title: 'tile-' + millis,
            body: 'body-' + millis,

        };
        this.fcm.saveNotification(notification).then(() => {
            this.refreshAllNotifications();
        });
    }

    public deleteNotification(itemKey: MyNotification) {
        this.fcm.deleteNotification(itemKey).then(() => {
            this.refreshAllNotifications();
        });
    }

    public tongleGroupExpansion(key: number) {
        this.groupExpansionControl.set(key, !this.groupExpansionControl.get(key))
    }

    public getGroupExpansionFlag(key: number) {
        return this.groupExpansionControl.get(key);
    }

    public refreshAllNotifications() {

        setTimeout(() => {
            console.log('refreshAllNotifications spinning has ended');
            this.waiting = false;
        }, 200);

        this.waiting = true;
        this.fcmNotifications.clear();
        this.fcm.getSavedNotifications().subscribe(
    values => {
            values.forEach((value: MyNotification[], key: number, map: Map<number, MyNotification[]>) => {
                this.fcmNotifications.set(key, value);
                if (!this.groupExpansionControl.has(key)) {
                    this.groupExpansionControl.set(key, false);
                }
            })
            this.waiting = false;
        },
    error => {
            this.waiting = false;
        });
    }
}
