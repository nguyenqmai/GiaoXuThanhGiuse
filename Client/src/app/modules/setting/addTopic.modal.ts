import {Component, Input} from '@angular/core';
import {TopicNode} from "../../model/topicnode.model";
import {ModalController} from "@ionic/angular";
@Component({
    templateUrl: 'addTopic.page.html',
    selector: 'addTopicModal'
})
export class AddTopicModal{
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
