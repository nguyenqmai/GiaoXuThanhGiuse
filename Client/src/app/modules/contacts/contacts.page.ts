import {Component, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {AlertController, ModalController} from '@ionic/angular';

import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {BackendService} from '../../services/backend.service';
import {Contact} from '../../model/contact.model';
import {ContactModal} from './contact.modal';

@Component({
    selector: 'contacts',
    templateUrl: 'contacts.page.html',
    styleUrls: ['contacts.page.scss']
})


export class ContactsPage implements OnInit {

    waiting = false;
    contacts: Contact[] = [];

    constructor(private logger: NGXLogger,
                private modalController: ModalController,
                private alertController: AlertController,
                private fcm: MyFirebaseMsgService,
                private backendService: BackendService) {
    }

    ngOnInit(): void {
        this.loadContacts();
    }

    doRefresh(event) {
        this.logger.debug('Begin async operation');
        this.loadContacts();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 1000);
    }


    public tongleContactExpansion(contact: Contact) {
        this.logger.debug('Inside tongleContactExpansion');
        contact.expanded = !contact.expanded;
    }

    public loadContacts() {
        this.waiting = true;
        this.backendService.getAllContacts().subscribe(contacts => {
            this.contacts = [];
            for (const contact of contacts) {
                if (contact.name && (contact.email || contact.phone)) {
                    this.contacts.push(contact);
                }
            }
            this.waiting = false;
        },
        error => {
            this.waiting = false;
        });
        setTimeout(() => {
            this.logger.debug('loadContacts spinning has ended');
            this.waiting = false;
        }, 200);
    }

    canManageUsers() {
        const currentUser = this.backendService.getAuthorizedUser();
        return currentUser && currentUser.hasValidTokens() && currentUser.authorizedToManageUsers();
    }

    canAddNewUsers() {
        const currentUser = this.backendService.getAuthorizedUser();
        return currentUser && currentUser.hasValidTokens() && currentUser.canAddNewUsers();
        // return true;
    }

    canUpdateUsers() {
        const currentUser = this.backendService.getAuthorizedUser();
        return currentUser && currentUser.hasValidTokens() && currentUser.canUpdateUsers();
        // return true;
    }

    async addUser() {
        await this.addOrEditUser({ id: null,
            expanded: false,
            title: null,
            name: '',
            phone: '',
            email: '',
            authorization: {}
        });
    }

    async editUser(contact: Contact, event) {
        this.logger.info(`Editing contact ${contact.name}`);
        event.stopPropagation();
        await this.addOrEditUser(contact);
    }

    async addOrEditUser(contact: Contact) {
        const modal = await this.modalController.create({
            component: ContactModal,
            componentProps: {
                'contact': contact
            }
        });
        modal.onDidDismiss().then((resp: any) => {
            if (resp !== null) {
                this.logger.debug('The response:', resp);
                if (resp['data'] != null) {
                    const tmpContact = resp['data'];
                    this.logger.debug('Contact updated/edited:', tmpContact);
                    if (!tmpContact.id) {
                        tmpContact.id = tmpContact.email;
                        this.contacts.push(tmpContact);
                    } else {
                        for (let index = 0; index < this.contacts.length; index++) {
                            if (this.contacts[index].id === tmpContact.id) {
                                this.contacts.splice(index, 1, tmpContact);
                                break;
                            }
                        }
                    }
                }
            }
        });
        await modal.present();
    }

}


