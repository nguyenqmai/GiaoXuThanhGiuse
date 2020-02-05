import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import {OverlayEventDetail} from '@ionic/core';

import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {BackendService} from '../../services/backend.service';
import {LoginModal} from './login.modal';
import {MyUser} from '../../model/MyUser.model';
import {ChangePasswordModal} from "./changePassword.modal";
import {ResetPasswordModal} from "./resetPassword.modal";


@Component({
    selector: 'app-setting',
    templateUrl: 'setting.page.html',
    styleUrls: ['setting.page.scss']
})



export class SettingPage implements OnInit {
    firstRefreshTime: number;
    refreshCount = 0;
    backendServerUrls: string[];
    selectedBackEndUrl: string;


    constructor(private logger: NGXLogger,
                private modalController: ModalController,
                private alertController: AlertController,
                private fcm: MyFirebaseMsgService,
                private backendService: BackendService) {
    }

    async ngOnInit() {
        this.backendServerUrls = this.backendService.getAvailableUrlPrefixes();
        this.selectedBackEndUrl = this.backendService.getCurrentUrlPrefix();
        this.firstRefreshTime = Date.now();
        this.refreshCount = 0;
    }

    public switchBackendServerUrl() {
        this.backendService.updateUrlPrefix(this.selectedBackEndUrl);
        this.refreshCount = 0;
    }

    hasValidAuthorizedUser(): boolean {
        const currentUser = this.backendService.getAuthorizedUser();
        return currentUser && currentUser.hasValidTokens();
    }

    async showLoginModal() {
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

    async sendResetPasswordEmail() {
        const modal = await this.modalController.create({
            component: ResetPasswordModal,
            componentProps: {
            }
        });
        modal.onDidDismiss().then((response: any) => {
        });
        await modal.present();
    }

    async changePasswordModal() {
        const modal = await this.modalController.create({
            component: ChangePasswordModal,
            componentProps: {
            }
        });
        modal.onDidDismiss().then((response: any) => {
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

    doRefresh(event) {
        this.logger.debug('Begin async operation');
        setTimeout(() => {
            event.target.complete();
            if (this.refreshCount === 0 || (Date.now() - this.firstRefreshTime) > 10000) {
                this.firstRefreshTime = Date.now();
                this.refreshCount = 0;
            }

            this.refreshCount += 1;
            this.logger.debug('Async operation has ended. refreshCount = ', this.refreshCount);
        }, 1000);
    }

    showAdvanceOptions() {
        this.refreshCount = (this.refreshCount + 1) % 4;
    }
}
