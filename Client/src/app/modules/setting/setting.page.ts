import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {BackendService} from '../../services/backend.service';
import {TopicNode} from '../../model/topicnode.model';
import {TopicGroup} from '../../model/topicgroup.model';
import {LoginModal} from './login.modal';
import {MyUser} from '../../model/MyUser.model';

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

    public clearStorage() {
        this.backendService.clearStorage();
    }

    hasValidAuthorizedUser() {
        const currentUser = this.backendService.getAuthorizedUser();
        return (currentUser != null && currentUser.getExpireTime() > Date.now());
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

    public logout() {
        this.backendService.setAuthorizedUser(null);
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
