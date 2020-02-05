import {Component, NgZone, OnInit} from '@angular/core';
import {OverlayEventDetail} from '@ionic/core';
import {AlertController, ModalController} from '@ionic/angular';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {NGXLogger} from 'ngx-logger';
import {LoginModal} from '../setting/login.modal';
import {MyUser} from '../../model/MyUser.model';

import {BackendService} from '../../services/backend.service';


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
                private modalController: ModalController,
                private alertController: AlertController,
                private fcm: MyFirebaseMsgService,
                private backendService: BackendService,
                private ngZone: NgZone) {
    }

    ngOnInit() {
        this.fcm.onMessageReceived().subscribe(msgs => {
            this.logger.info(`got msg inside TabsPage ${JSON.stringify(msgs)}`);
            if (this.currentTab !== 'notifications') {
                this.ngZone.run(() => {
                    this.newNotificationCount += msgs.length;
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


    hasValidAuthorizedUser(): boolean {
        const currentUser = this.backendService.getAuthorizedUser();
        return currentUser && currentUser.hasValidTokens();
    }

    public getMinutesLeft(): number {
        return this.backendService.getMinutesLeft();
    }
}
