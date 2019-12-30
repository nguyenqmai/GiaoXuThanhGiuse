import {Component, OnInit} from '@angular/core';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {NGXLogger} from "ngx-logger";

import {BackendService} from "../../services/backend.service";
import {Contact} from "../../model/contact.model";

@Component({
    selector: 'contacts',
    templateUrl: 'contacts.page.html',
    styleUrls: ['contacts.page.scss']
})


export class ContactsPage implements OnInit{

    waiting: boolean = false;
    contacts: Contact[] = []

    constructor(private logger: NGXLogger,
                private fcm: MyFirebaseMsgService, private backendService: BackendService) {
    }

    ngOnInit(): void {
        this.loadContacts()
    }

    doRefresh(event) {
        this.logger.debug('Begin async operation');
        this.loadContacts();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 1000);
    }

    public loadContacts() {
        this.waiting = true;
        this.backendService.getAllContacts().subscribe(contacts => {
            this.contacts = [];
            for (let contact of contacts) {
                if (contact.name && (contact.email || contact.phone))
                    this.contacts.push(contact)
            }
            this.waiting = false;
        },
        error => {
            this.waiting = false;
        });
        setTimeout(() => {
            this.logger.debug('loadContacts spinning has ended');
            this.waiting = false
        }, 200);
    }

}
