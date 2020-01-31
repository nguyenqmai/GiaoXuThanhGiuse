import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {IonicModule} from '@ionic/angular';

import {TabsPageRoutingModule} from './tabs.router.module';
import {TabsPage} from './tabs.page';
import {LoginModal} from './login.modal';
import {environment} from '../../../environments/environment';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
    ],
    declarations: [TabsPage, LoginModal],
    entryComponents: [LoginModal]
})
export class TabsPageModule {
}
