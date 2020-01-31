import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'manageSendMessagePermission',
    templateUrl: 'manageSendMessagePermission.page.html'
})



export class ManageSendMessagePermissionModal implements OnInit {
    @Input() addSubTopicSetting: any;
    @Input() sendMessageToAllSubTopicSetting: any;
    @Input() sendMessageToEachTopicPermissions: any[];

    failedReason: any = null;
    waiting = false;

    constructor(private logger: NGXLogger,
                private modalController: ModalController) {
    }

    ngOnInit() {
    }

    public submit() {
        this.failedReason = null;
        this.waiting = true;
        let ret = [this.addSubTopicSetting, this.sendMessageToAllSubTopicSetting];
        ret = ret.concat(this.sendMessageToEachTopicPermissions);
        return this.modalController.dismiss(ret);
    }

    public toggleAddSubTopicSettingClicked() {
    }

    public toggleSendMessageToAllSubTopicSettingClicked() {
        if (this.sendMessageToAllSubTopicSetting['permissionFlag']) {
            for (const subtopic of this.sendMessageToEachTopicPermissions) {
                subtopic['permissionFlag'] = false;
            }
        }
    }

    public toggleCanSendMessageSubTopicClicked(topic: any) {
    }
}

