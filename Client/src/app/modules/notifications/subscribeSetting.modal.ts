import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {BackendService} from '../../services/backend.service';
import {TopicNode} from '../../model/topicnode.model';
import {TopicGroup} from '../../model/topicgroup.model';
import {SendNotificationModal} from './sendNotification.modal';
import {AddTopicModal} from './addTopic.modal';

@Component({
    selector: 'subscribesetting',
    templateUrl: 'subscribesetting.page.html'
})



export class SubscribeSettingModal implements OnInit {
    topicGroups = new Map<string, TopicGroup>();

    constructor(private logger: NGXLogger,
                private modalController: ModalController,
                private fcm: MyFirebaseMsgService, private backendService: BackendService) {
    }

    async ngOnInit() {
        const topicGroups = await this.backendService.loadCurrentSubscriptionsFromLocalStorage();
        if (topicGroups == null) {
            return;
        }
        for (const group of <TopicGroup[]>topicGroups) {
            this.topicGroups.set(group.id, group);
        }

        if (this.topicGroups.size === 0) {
            this.refreshTopics();
        }
    }

    doRefresh(event) {
        this.logger.debug('Begin async operation');
        this.refreshTopics();
        setTimeout(() => {
            event.target.complete();
        }, 1000);
    }

    public cancel() {
        return this.modalController.dismiss();
    }

    public async addTopic(group: TopicGroup) {
        this.logger.debug(`Add topic dialog for group ${JSON.stringify(group)}`);

        const modal = await this.modalController.create({
            component: AddTopicModal,
            componentProps: {
                'group': group
            }
        });
        modal.onDidDismiss().then((resp: any) => {
            if (resp !== null) {
                this.logger.debug('The response:', resp);
                if (resp['data'] != null) {
                    this.logger.debug('New topic created: ', resp['data']);
                    this.refreshTopics();
                }
            }
        });
        await modal.present();
    }

    public getTopicGroups(): TopicGroup[] {
        const ret = [];
        this.topicGroups.forEach((group, idKey, m) => {
            ret.push(group);
        });
        return ret;
    }

    public tongleGroupExpansion(parentGroup: any) {
        parentGroup.expanded = !parentGroup.expanded;
    }

    public checkboxItemClicked(item: TopicNode) {
        this.logger.debug(`topic name ${item.englishName}`);
        this.backendService.saveCurrentSubscriptions(this.topicGroups);
        if (item.subscribed) {
            this.logger.debug(`subscribing to topic ${JSON.stringify(item)}`);
            this.fcm.subscribeToTopic(item.id);
        } else {
            this.logger.debug(`unsubscribing from topic ${JSON.stringify(item)}`);
            this.fcm.unsubscribeFromTopic(item.id);
        }
    }

    public refreshTopics() {
        this.backendService.getAllAvailableTopics().subscribe(topics => {
            if (!topics || topics.length === 0) {
                return;
            }
            const _new = this.backendService.buildTopicGroups(topics);
            this.backendService.buildSubTopics(_new, topics);
            this.syncCurrentTopicGroups(_new);
        });
    }

    private syncCurrentTopicGroups(newItems: Map<string, TopicGroup>) {
        const toBeUnsubscribed: TopicNode[] = [];
        this.topicGroups.forEach((group, idKey, m) => {
            for (const topic of group.subtopics) {
                let foundNewTopic = false;
                newItems.forEach((_group, _idKey, _m) => {
                    if (group.id === _group.id) {
                        _group.expanded = group.expanded;
                    }

                    for (const _topic of _group.subtopics) {
                        if (topic.id === _topic.id) {
                            foundNewTopic = true;
                            _topic.subscribed = topic.subscribed;
                        }
                    }
                });
                if (!foundNewTopic) {
                    topic.subscribed = false;
                    toBeUnsubscribed.push(topic);
                }
            }
        });
        this.topicGroups = newItems;
        this.backendService.saveCurrentSubscriptions(this.topicGroups);

        for (const item of toBeUnsubscribed) {
            this.checkboxItemClicked(item);
        }
    }

    public authorizedToWorkWithNotification() {
        return this.backendService.getAuthorizedUser() != null &&
            this.backendService.getAuthorizedUser().authorizedToWorkWithNotification();
    }

    public canSendNotification(topic: TopicNode): boolean {
        if (topic == null || !this.authorizedToWorkWithNotification()) {
            return false;
        }
        return this.backendService.getAuthorizedUser().canSendNotificationToTopic(topic.parentId, topic.id);
    }

    public canAddTopic(group: TopicGroup): boolean {
        if (group == null || !this.authorizedToWorkWithNotification()) {
            return false;
        }
        return this.backendService.getAuthorizedUser().canAddTopic(group.id);
    }

    public async sendMessageToTopic(topic: TopicNode) {
        const modal = await this.modalController.create({
            component: SendNotificationModal,
            componentProps: {
                'topic': topic
            }
        });
        modal.onDidDismiss().then((resp: any) => {
            if (resp !== null) {
                this.logger.debug('The response:', resp);
                if (resp['data'] != null) {
                    this.logger.debug('Msg to send:', resp['data']);
                    this.backendService.sendNotification(topic, resp.data.title, resp.data.body).subscribe((msgStatus) => {
                        this.logger.debug('Msg sent status:', msgStatus);
                    });
                }
            }
        });
        await modal.present();
    }
}
