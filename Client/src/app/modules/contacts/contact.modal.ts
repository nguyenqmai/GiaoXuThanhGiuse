import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {NGXLogger} from 'ngx-logger';

import {Contact} from '../../model/contact.model';
import {BackendService} from '../../services/backend.service';
import {ManageOtherUsersModal} from './manageOtherUsers.modal';
import {TopicGroup} from '../../model/topicgroup.model';
import {ManageSendMessagePermissionModal} from './manageSendMessagePermission.modal';


@Component({
    templateUrl: 'contact.page.html',
    selector: 'contactModal'
})
export class ContactModal implements OnInit {
    @Input() contact: Contact;

    failedReason: any = null;
    waiting = false;
    sendMessagePermissionsToggle = false;
    topicGroups = [];

    constructor(private logger: NGXLogger,
                private modalController: ModalController,
                private backendService: BackendService) {
    }

    ngOnInit(): void {
        this.waiting = true;
        this.backendService.getAllAvailableTopicGroups().subscribe( topicGroups => {
            this.topicGroups = topicGroups;
            this.waiting = false;
        },
            (error) => {
                this.failedReason = error;
                this.waiting = false;
            });
    }

    public cancel() {
        return this.modalController.dismiss();
    }

    public hasRequiredData(): boolean {
        return this.contact.name.length > 0 && this.contact.email.length > 0 && this.contact.phone.length > 0;
    }

    private hasUserPermission(permission: string): boolean {
        return this.contact.authorization &&
            this.contact.authorization['users'] &&
            (this.contact.authorization['users'] as string[]).includes(permission);
    }

    async manageOtherUserAccounts() {
        const permissionsToggles = [
            {'description': 'Can add user-accounts', 'permission': 'CAN_ADD', 'permissionFlag': this.hasUserPermission('CAN_ADD')},
            {'description': 'Can delete user-accounts', 'permission': 'CAN_DELETE', 'permissionFlag': this.hasUserPermission('CAN_DELETE')},
            {'description': 'Can update user-accounts', 'permission': 'CAN_UPDATE', 'permissionFlag': this.hasUserPermission('CAN_UPDATE')}
        ];
        const modal = await this.modalController.create({
            component: ManageOtherUsersModal,
            componentProps: {
                'permissionsToggles': permissionsToggles
                }
        });
        modal.onDidDismiss().then((resp: any) => {
            if (resp !== null) {
                this.logger.debug('The response:', resp);
                if (resp['data'] != null) {
                    const permissions = [];
                    for (const toggle of resp['data']) {
                        if (toggle['permissionFlag']) {
                            permissions.push(toggle['permission']);
                        }
                    }
                    if (!this.contact['authorization']) {
                        this.contact['authorization'] = {};
                    }
                    this.contact.authorization['users'] = permissions;
                    this.logger.debug('Contact authorization updated: ', this.contact.authorization);
                }
            }
        });
        await modal.present();
    }

    // toggleSendMessagePermissions() {
    //     this.sendMessagePermissionsToggle = !this.sendMessagePermissionsToggle;
    // }

    private hasPermissionForTopic(name: string, permission: string): boolean {
        return this.contact.authorization &&
            this.contact.authorization[name] &&
            (this.contact.authorization[name] as string[]).includes(permission);
    }

    async manageSendMessagePermissions(group: TopicGroup) {
        const sendMessageToEachTopicPermissions = [];
        for (const subTopic of group.subtopics) {
            sendMessageToEachTopicPermissions.push({'topicId': subTopic.id,
                'topicName': subTopic.englishName,
                'permission': 'CAN_SEND_MSG',
                'permissionFlag': this.hasPermissionForTopic(subTopic.id, 'CAN_SEND_MSG')});
        }
        const modal = await this.modalController.create({
            component: ManageSendMessagePermissionModal,
            componentProps: {
                'addSubTopicSetting':
                    {'description': 'Can add new sub-topics',
                        'topicId': group.id,
                        'topicName': group.englishName,
                        'permission': 'CAN_ADD_TOPIC',
                        'permissionFlag': this.hasPermissionForTopic(group.id, 'CAN_ADD_TOPIC')},
                'sendMessageToAllSubTopicSetting':
                    {'description': 'Can send notification to sub-topics:',
                        'topicId': group.id,
                        'topicName': group.englishName,
                        'permission': 'CAN_SEND_MSG',
                        'permissionFlag': this.hasPermissionForTopic(group.id, 'CAN_SEND_MSG')},
                'sendMessageToEachTopicPermissions': sendMessageToEachTopicPermissions
            }
        });
        modal.onDidDismiss().then((resp: any) => {
            if (resp !== null) {
                this.logger.debug('The response:', resp);
                if (resp['data'] != null) {
                    this.logger.debug('Returned permission settings: ', resp['data']);
                    if (!this.contact.authorization) {
                        this.contact.authorization = {};
                    }
                    for (const item of resp['data']) {
                        if (!item['permissionFlag']) {
                            continue;
                        }

                        let foundPermissions = this.contact.authorization[item['topicId']];
                        if (foundPermissions == null) {
                            foundPermissions = [];
                            this.contact.authorization[item['topicId']] = foundPermissions;
                        }
                        foundPermissions.push(item['permission']);
                    }
                    this.logger.debug('Contact authorization updated: ', this.contact.authorization);
                }
            }
        });
        await modal.present();
    }

    public save() {
        this.failedReason = null;
        this.waiting = true;

        this.backendService.upsertContact(this.contact).subscribe(result => {
            this.waiting = false;
            return this.modalController.dismiss(this.contact);
        },
        (error) => {
            this.failedReason = error;
            this.waiting = false;
        });
    }
}
