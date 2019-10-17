import {Component, OnInit} from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import {FcmService} from '../../services/fcm.service';
import {BackendService} from "../../services/backend.service";
import {TopicNode} from "../../model/topicnode.model";
import {TopicGroup} from "../../model/topicgroup.model";

@Component({
    selector: 'app-setting',
    templateUrl: 'setting.page.html',
    styleUrls: ['setting.page.scss']
})


export class SettingPage implements OnInit {
    topicGroups = new Map<string, TopicGroup>();
    newBackendServerUrl: string = "http://69.221.129.172:8080/rest";

    constructor(private logger: NGXLogger, private fcm: FcmService, private backendService: BackendService) {
    }

    ngOnInit(): void {
        // this.newBackendServerUrl = this.getBackendServerUrl();
        this.topicGroups = this.backendService.getCurrentSubscriptions();
        if (this.topicGroups.size == 0) {
            this.refreshTopics();
        }
    }

    doRefresh(event) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

    public getTopicGroups(): TopicGroup[] {
        let ret = [];
        this.topicGroups.forEach((group, idKey, m) => {
            ret.push(group);
        });
        return ret;
    }

    public saveSubscriptions() {
        // for (let group of this.groups) {
        //     for (let item of group.subItems) {
        //         if (!item.status) {
        //             continue;
        //         }
        //
        //         this.logger.debug(`subscribing to topic ${item.topicId}`);
        //         this.fcm.subscribeToTopic(item.topicId);
        //     }
        // }
    }

    public tongleGroupExpansion(parentGroup: any) {
        parentGroup.expanded = !parentGroup.expanded;
    }

    public checkboxItemClicked(parentGroup: TopicGroup, item: TopicNode) {
        this.logger.debug(`group name ${parentGroup.vietnameseName} checkbox name ${item.vietnameseName}`);
        for (let sitem of parentGroup.subtopics) {
            this.logger.debug('sub-item name ' + sitem.vietnameseName + ' sub-item status ' + sitem.subscribed);
        }
    }


    public refreshTopics() {
        this.backendService.getAllAvailableTopics().subscribe(
            topics => {
                this.topicGroups = this.backendService.buildTopicGroups(topics);
                this.backendService.buildSubTopics(this.topicGroups, topics);
            })
    }

    public updateLocalBackendServerUrlValue(event) {
        this.newBackendServerUrl = event.target.value;
    }

    public getBackendServerUrl(): string {
        return this.backendService.getCurrentUrlPrefix();
    }

    public switchBackendServerUrl() {
        this.backendService.updateUrlPrefix(this.newBackendServerUrl);
    }
}
