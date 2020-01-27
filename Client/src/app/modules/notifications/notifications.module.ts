import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NotificationsPage} from './notifications.page';
import {SendNotificationModal} from './sendNotification.modal';
import {AddTopicModal} from './addTopic.modal';
import {SubscribeSettingModal} from './subscribeSetting.modal';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{
            path: '',
            component: NotificationsPage
        }])
    ],
    declarations: [NotificationsPage, SubscribeSettingModal, SendNotificationModal, AddTopicModal],
    entryComponents: [
        SubscribeSettingModal, SendNotificationModal, AddTopicModal
    ]
})
export class NotificationsPageModule {
}
