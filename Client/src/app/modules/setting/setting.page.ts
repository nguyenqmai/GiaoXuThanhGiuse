import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';

import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {BackendService} from '../../services/backend.service';

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
