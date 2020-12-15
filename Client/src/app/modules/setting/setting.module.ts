import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SettingPage} from './setting.page';
import {LoginModal} from './login.modal';
import {ResetPasswordModal} from './resetPassword.modal';
import {ChangePasswordModal} from './changePassword.modal';
import {AdvanceModal} from './advance.modal';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: SettingPage}]),
    ],
    declarations: [SettingPage, LoginModal, ResetPasswordModal, ChangePasswordModal, AdvanceModal],
    entryComponents: [LoginModal, ResetPasswordModal, ChangePasswordModal, AdvanceModal]
})
export class SettingPageModule {
}
