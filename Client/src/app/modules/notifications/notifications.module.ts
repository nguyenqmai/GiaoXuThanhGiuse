import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NotificationsPage} from './notifications.page';
import {SubscribeSettingModal} from './topics/subscribeSetting.modal';
import {SendNotificationModal} from './topics/sendNotification.modal';
import {AddTopicModal} from './topics/addTopic.modal';

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
    entryComponents: [SubscribeSettingModal, SendNotificationModal, AddTopicModal]
})
export class NotificationsPageModule {
}
