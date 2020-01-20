import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TopicGroup} from '../../model/topicgroup.model';
import {BackendService} from '../../services/backend.service';
import {TopicNode} from '../../model/topicnode.model';

@Component({
    templateUrl: 'addTopic.page.html',
    selector: 'addTopicModal'
})
export class AddTopicModal {
    @Input() group: TopicGroup;

    englishName: string;
    vietnameseName: string;

    failedReason: any = null;
    waiting = false;

    constructor(private modalController: ModalController,
                private backendService: BackendService) {
    }

    public cancel() {
        return this.modalController.dismiss();
    }

    public hasRequiredData(): boolean {
        return this.englishName != null && this.englishName.trim().length > 0 &&
            this.vietnameseName != null && this.vietnameseName.trim().length > 0;
    }

    public addSubTopic() {
        this.failedReason = null;
        this.waiting = true;

        const newTopic: TopicNode = {
            'id': this.englishName.trim().replace(/\s+/g, '_'),
            'subscribed': false,
            'parentId': this.group.id,
            'vietnameseName': this.vietnameseName.trim().replace(/\s+/g, ' '),
            'englishName': this.englishName.trim().replace(/\s+/g, ' ')
        }
        this.backendService.addNewTopic(newTopic).subscribe((addTopicResult) => {
            this.waiting = false;
            return this.modalController.dismiss(newTopic);
        },
        (error) => {
            this.failedReason = error;
            this.waiting = false;
        });
    }
}
