import {Component, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {BackendService} from '../../services/backend.service';
import {Contact} from '../../model/contact.model';

@Component({
    selector: 'contacts',
    templateUrl: 'contacts.page.html',
    styleUrls: ['contacts.page.scss']
})


export class ContactsPage implements OnInit {

    waiting = false;
    contacts: Contact[] = [];

    constructor(private logger: NGXLogger,
                private fcm: MyFirebaseMsgService, private backendService: BackendService) {
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

}
