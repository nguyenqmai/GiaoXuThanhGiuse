import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NotificationsPage} from './notifications.page';
import {SubscribesettingPage} from './subscribesetting.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{
            path: '',
            component: NotificationsPage
        },
        {
            path: 'subscribesetting',
            component: SubscribesettingPage,
        }
        ])
    ],
    declarations: [NotificationsPage, SubscribesettingPage]
})
export class NotificationsPageModule {
}
