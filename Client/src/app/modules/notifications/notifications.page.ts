import {Component} from '@angular/core';
import {FcmService} from '../../services/fcm.service';
import {FcmNotification} from '../../model/fcmnotification.model';

// import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notifications',
    templateUrl: 'notifications.page.html',
    styleUrls: ['notifications.page.scss']
})


export class NotificationsPage {
    fcmNotifications: FcmNotification[] = [];

    constructor(private fcm: FcmService) {
    }

    ngOnInit() {
        this.refreshAllNotifications();
    }

    public getAllNotifications() {
        return [];
    }

    public insertRandomNotification() {
        let millis = Date.now();
        let notification = {
            title: 'tile-' + millis,
            label: 'label-' + millis,
            tap: false,
            body: 'body-' + millis,
            topic: 'topic-' + millis
        };
        this.fcm.saveNotification(notification).then(() => {
            this.refreshAllNotifications();
        });
    }

    public deleteNotification(itemKey: string) {
        this.fcm.deleteNotification(itemKey).then(() => {
            this.refreshAllNotifications();
        });
    }

    public refreshAllNotifications() {
        this.fcm.getSavedNotifications().subscribe(values => {
            this.fcmNotifications = values;
        });
    }
}
