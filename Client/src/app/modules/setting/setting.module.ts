import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SettingPage} from './setting.page';

import {FcmService} from '../../services/fcm.service';
import {SendNotificationModal} from "./sendNotification.modal";
import {AddTopicModal} from "./addTopic.modal";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: SettingPage}])
    ],
    declarations: [SettingPage, SendNotificationModal, AddTopicModal],
    entryComponents: [
        SendNotificationModal, AddTopicModal
    ]
})
export class SettingPageModule {
    constructor(
        private fcm: FcmService
    ) {
    }
}
