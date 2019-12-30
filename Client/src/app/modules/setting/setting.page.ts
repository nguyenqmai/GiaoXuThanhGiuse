import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';
import {BackendService} from "../../services/backend.service";
import {TopicNode} from "../../model/topicnode.model";
import {TopicGroup} from "../../model/topicgroup.model";
import {SendNotificationModal} from "./sendNotification.modal";
import {LoginModal} from "./login.modal";
import {MyUser} from "../../model/MyUser.model";

@Component({
    selector: 'app-setting',
    templateUrl: 'setting.page.html',
    styleUrls: ['setting.page.scss']
})



export class SettingPage implements OnInit {
    topicGroups = new Map<string, TopicGroup>();
    firstRefreshTime: number;
    refreshCount: number = 0;
    backendServerUrls: string[];
    selectedBackEndUrl: string;


    constructor(private logger: NGXLogger,
                private modalController: ModalController,
                private fcm: MyFirebaseMsgService, private backendService: BackendService) {
    }

    async ngOnInit() {
        this.backendServerUrls = this.backendService.getAvailableUrlPrefixes();
        this.selectedBackEndUrl = this.backendService.getCurrentUrlPrefix();
        this.firstRefreshTime = Date.now();
        this.refreshCount = 0;
        this.backendService.loadCurrentSubscriptionsFromLocalStorage().subscribe(topicGroups => {
                if (topicGroups == null)
                    return;
                for (let group of <TopicGroup[]>topicGroups) {
                    this.topicGroups.set(group.id, group);
                }
            })
        if (this.topicGroups.size == 0) {
            this.refreshTopics();
        }
    }

    public switchBackendServerUrl() {
        this.backendService.updateUrlPrefix(this.selectedBackEndUrl);
        this.refreshCount = 0;
    }

    public clearStorage() {
        this.backendService.clearStorage();
    }

    public async showLoginModal() {

        const modal = await this.modalController.create({
            component: LoginModal,
            componentProps: {
            }
        });
        modal.onDidDismiss().then((response: any) => {
            if (response && response['data'] && response['data']['userEmail'] && response['data']['idToken'] && response['data']['accessToken']) {
                this.logger.debug('The response:', response);
                this.backendService.setAuthorizedUser(new MyUser(response['data']['userEmail'], response['data']['idToken'], response['data']['accessToken']));
            }
        });
        await modal.present();

    }

    public logout() {
        this.backendService.setAuthorizedUser(null);
    }

    doRefresh(event) {
        this.logger.debug('Begin async operation');
        this.refreshTopics();
        setTimeout(() => {
            event.target.complete();
            if (this.refreshCount == 0 || (Date.now() - this.firstRefreshTime) > 10000) {
                this.firstRefreshTime = Date.now();
                this.refreshCount = 0;
            }

            this.refreshCount += 1;
            this.logger.debug('Async operation has ended. refreshCount = ', this.refreshCount);
        }, 1000);
    }

    showAdvanceOptions() {
        this.refreshCount = (this.refreshCount + 1) % 4;
    }

    public addTopic(group: TopicGroup) {
        this.logger.debug(`Add topic dialog for group ${JSON.stringify(group)}`);
    }

    public getTopicGroups(): TopicGroup[] {
        let ret = [];
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
            if (!topics || topics.length == 0)
                return;
            let _new = this.backendService.buildTopicGroups(topics);
            this.backendService.buildSubTopics(_new, topics);
            this.syncCurrentTopicGroups(_new);
        })
    }

    private syncCurrentTopicGroups(newItems: Map<string, TopicGroup>) {
        let toBeUnsubscribed: TopicNode[] = []
        this.topicGroups.forEach((group, idKey, m) => {
            for (let topic of group.subtopics) {
                let foundNewTopic = false;
                newItems.forEach((_group, _idKey, _m) => {
                    if (group.id == _group.id)
                        _group.expanded = group.expanded;

                    for (let _topic of _group.subtopics) {
                        if (topic.id == _topic.id) {
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

        for (let item of toBeUnsubscribed) {
            this.checkboxItemClicked(item);
        }
    }

    public authorizedToSendNotification() {
        return this.backendService.getAuthorizedUser() != null && this.backendService.getAuthorizedUser().authorizedToSendNotification();
    }

    public canSendNotification(topic: TopicNode): boolean {
        if (topic == null || !this.authorizedToSendNotification())
            return false;

        return this.backendService.getAuthorizedUser().canSendNotificationToTopic(topic.parentId, topic.id)
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
                    this.backendService.sendNotification(topic, resp.data.title, resp.data.body).subscribe(resp => {
                        this.logger.debug('Msg sent status:', resp);
                    })
                }
            }
        });
        await modal.present();
    }
}
