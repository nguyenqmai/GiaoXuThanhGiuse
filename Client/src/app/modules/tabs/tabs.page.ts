import {Component, NgZone, OnInit} from '@angular/core';
import {OverlayEventDetail} from '@ionic/core';
import {AlertController, ModalController} from '@ionic/angular';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {NGXLogger} from 'ngx-logger';
import {LoginModal} from './login.modal';
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

    public async showLoginModal() {
        const modal = await this.modalController.create({
            component: LoginModal,
            componentProps: {
            }
        });
        modal.onDidDismiss().then((response: any) => {
            if (response && response['data'] &&
                response['data']['userEmail'] &&
                response['data']['idToken'] && response['data']['accessToken']) {
                this.logger.debug('The response:', response);
                this.backendService.setAuthorizedUser(
                    new MyUser(response['data']['userEmail'],
                        response['data']['idToken'],
                        response['data']['accessToken']));
            }
        });
        await modal.present();
    }

    async logout() {
        const alert = await this.alertController.create({
            message: 'Sign-out of your account?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        alert.dismiss();
                        return false;
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        alert.dismiss(true);
                        return false;
                    }
                }
            ]
        });
        alert.onDidDismiss().then((detail: OverlayEventDetail) => {
            if (detail.data) {
                this.backendService.setAuthorizedUser(null);
            }
        });
        await alert.present();
    }

    public getMinutesLeft(): number {
        return this.backendService.getMinutesLeft();
    }
}
