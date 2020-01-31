import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ContactsPage} from './contacts.page';
import {ContactModal} from './contact.modal';
import {ManageOtherUsersModal} from './manageOtherUsers.modal';
import {ManageSendMessagePermissionModal} from './manageSendMessagePermission.modal';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: ContactsPage}])
    ],
    declarations: [ContactsPage, ContactModal, ManageOtherUsersModal, ManageSendMessagePermissionModal],
    entryComponents: [ContactModal, ManageOtherUsersModal, ManageSendMessagePermissionModal]
})
export class ContactsPageModule {
}
