import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TopicNode} from '../../../model/topicnode.model';

@Component({
    templateUrl: 'sendNotification.page.html',
    selector: 'sendNotificationModal'
})
export class SendNotificationModal {
    @Input() topic: TopicNode;

    title: string;
    body: string;

    constructor(private modalController: ModalController) {
    }

    public cancel() {
        return this.modalController.dismiss();
    }

    public hasRequiredData(): boolean {
        return this.title != null && this.title.trim().length > 0 && this.body != null && this.body.trim().length > 0;
    }

    public send() {
        return this.modalController.dismiss({'title': this.title, 'body': this.body});
    }
}

