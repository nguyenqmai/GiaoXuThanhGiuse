import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {MyNotification} from '../../model/fcmnotification.model';



@Component({
    selector: 'app-notifications',
    templateUrl: 'notifications.page.html',
    styleUrls: ['notifications.page.scss']
})


export class NotificationsPage implements OnInit {
    groupExpansionControl: Map<number, boolean> = new Map<number, boolean>();
    fcmNotifications: Map<number, MyNotification[]> = new Map<number, MyNotification[]>();
    notificationKeys: number[];
    searchText = '';
    refreshCount = 0;
    waiting = false;

    constructor(private logger: NGXLogger, private fcm: MyFirebaseMsgService, private ngZone: NgZone,
                private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.refreshAllNotifications();
        this.fcm.onNotificationOpen().subscribe(msgs => {
            this.logger.info(`got msg inside NotificationsPage ${JSON.stringify(msgs)}`);
            this.ngZone.run(() => { this.refreshAllNotifications(); });
        });
    }

    doRefresh(event) {
        this.logger.debug('Begin async operation');
        this.refreshAllNotifications();
        setTimeout(() => {
            this.logger.debug('Async operation has ended');
            this.refreshCount += 1;
            event.target.complete();
        }, 1000);
    }

    options() {
        this.router.navigate(['subscribesetting'], { relativeTo: this.route });
    }

    onSearchInput(event) {
        // this.logger.debug(`entering text [${event.detail.data}]`);
        if (this.searchText.length >= 1) {
            this.ngZone.run(() => {
                // this.logger.debug(`searchText [${this.searchText}]`);
                this.notificationKeys = Array.from(this.fcmNotifications.keys()).sort().reverse();
            });
        }
    }

    public getNotificationsOfKey(key: number): MyNotification[] {
        if (this.searchText == null || this.searchText.length === 0) {
            return this.fcmNotifications.get(key);
        }

        const lowerCaseSearchText = this.searchText.toLowerCase();
        const ret: MyNotification[] = [];
        for (const msg of this.fcmNotifications.get(key)) {
            if (msg.title.toLowerCase().indexOf(lowerCaseSearchText) >= 0 ||
                msg.body.toLowerCase().indexOf(lowerCaseSearchText) >= 0) {
                ret.push(msg);
            }
        }
        return ret;

    }

    public insertRandomNotification() {
        const millis = Date.now();
        const notification = {
            id: '' + millis,
            creationTime: millis,
            tap: false,
            topic: 'topic-' + millis,
            title: 'tile-' + millis,
            body: 'body-' + millis,

        };
        this.fcm.saveNotification([notification]).then(() => {
            this.refreshAllNotifications();
        });
    }

    public deleteNotification(itemKey: MyNotification) {
        this.fcm.deleteNotification(itemKey).then(() => {
            this.refreshAllNotifications();
        });
    }

    public tongleGroupExpansion(key: number) {
        this.groupExpansionControl.set(key, !this.groupExpansionControl.get(key));
    }

    public getGroupExpansionFlag(key: number) {
        return this.groupExpansionControl.get(key);
    }

    public refreshAllNotifications() {
        this.waiting = true;
        try {
            this.fcmNotifications.clear();
            this.fcm.getSavedNotifications().subscribe(
                values => {
                    this.logger.info('Notification.refreshAllNotifications(): next value');
                    values.forEach((value: MyNotification[], key: number, map: Map<number, MyNotification[]>) => {
                        this.fcmNotifications.set(key, value);
                        if (!this.groupExpansionControl.has(key)) {
                            this.groupExpansionControl.set(key, false);
                        }
                    });
                    this.waiting = false;
                    this.notificationKeys = Array.from(this.fcmNotifications.keys()).sort().reverse();
                },
                error => {
                    this.logger.info('Notification.refreshAllNotifications(): error');
                    this.waiting = false;
                },
                () => {
                    this.logger.info('Notification.refreshAllNotifications(): complete');
                    this.waiting = false;
                });
        } catch (error) {
            this.waiting = false;
            this.logger.warn('Notification.refreshAllNotifications(): catch error: ', error);
        }
    }
}
