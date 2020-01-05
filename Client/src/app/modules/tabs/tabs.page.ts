import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {NGXLogger} from 'ngx-logger';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
    hasNewNotificationFlag: boolean = false;

    constructor(private logger: NGXLogger,
                private fcm: MyFirebaseMsgService,
                private ngZone: NgZone,
                private ref: ChangeDetectorRef) {
        // ref.detach();
        // setInterval(() => {
        //     this.ref.detectChanges();
        // }, 5000);
    }

    public hasNewNotification(): boolean {
        return this.hasNewNotificationFlag;
    }
    ngOnInit() {
        this.fcm.onNotificationOpen().subscribe(data => {
            this.logger.info(`got msg inside TabsPage ${JSON.stringify(data)}`);
            this.ngZone.run(() => {
                this.hasNewNotificationFlag = true;
            });
            // this.ref.detectChanges();
        });
    }

    ionTabsDidChange(event: any) {
        this.logger.info(`ionTabsDidChange to  ${event['tab']}`);
        if (event['tab'] === 'notifications') {
            this.hasNewNotificationFlag = false;
        }
    }

    ionTabsWillChange(event: any) {
        this.logger.info(`ionTabsWillChange to  ${event['tab']}`);
    }

}
