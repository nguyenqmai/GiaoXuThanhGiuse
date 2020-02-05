import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SettingPage} from './setting.page';
import {LoginModal} from './login.modal';
import {ResetPasswordModal} from './resetPassword.modal';
import {ChangePasswordModal} from './changePassword.modal';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: SettingPage}]),
    ],
    declarations: [SettingPage, LoginModal, ResetPasswordModal, ChangePasswordModal],
    entryComponents: [LoginModal, ResetPasswordModal, ChangePasswordModal]
})
export class SettingPageModule {
}
