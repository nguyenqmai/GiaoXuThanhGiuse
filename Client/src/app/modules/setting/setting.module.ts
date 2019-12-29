import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SettingPage} from './setting.page';

import {SendNotificationModal} from "./sendNotification.modal";
import {AddTopicModal} from "./addTopic.modal";
import {LoginModal} from "./login.modal";
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";

import {environment} from "../../../environments/environment";
@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: SettingPage}]),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,

    ],
    declarations: [SettingPage, SendNotificationModal, AddTopicModal, LoginModal],
    entryComponents: [
        SendNotificationModal, AddTopicModal, LoginModal
    ]
})
export class SettingPageModule {
}
