import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {NGXLogger} from 'ngx-logger';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
    newNotificationCount = 0;
    currentTab = '';
    nextTab = '';

    constructor(private logger: NGXLogger,
                private fcm: MyFirebaseMsgService,
                private ngZone: NgZone) {
    }

    ngOnInit() {
        this.fcm.onNotificationOpen().subscribe(data => {
            this.logger.info(`got msg inside TabsPage ${JSON.stringify(data)}`);
            if (this.currentTab !== 'notifications') {
                this.ngZone.run(() => {
                    this.newNotificationCount += 1;
                });
            }
        });
    }

    ionTabsDidChange(event: any) {
        this.currentTab = event['tab'];
        this.nextTab = '';
        this.logger.info(`ionTabsDidChange to  ${this.currentTab}`);
        if (this.currentTab === 'notifications') {
            this.newNotificationCount = 0;
        }
    }

    ionTabsWillChange(event: any) {
        this.nextTab = event['tab'];
        this.logger.info(`ionTabsWillChange to  ${this.nextTab}`);
    }

}
