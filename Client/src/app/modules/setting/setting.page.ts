import {Component} from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import {FcmService} from '../../services/fcm.service';

@Component({
    selector: 'app-setting',
    templateUrl: 'setting.page.html',
    styleUrls: ['setting.page.scss']
})


export class SettingPage {
    private groups = [
        {
            name: 'Tin nhan chung cua nha tho',
            topicId: 'MainGroup01',
            expanded: false,
            subItems: [
                {
                    name: 'Tin nhan nha tho 01',
                    topicId: 'MainGroup01.SubGroup01',
                    status: false,
                },
                {
                    name: 'Tin nhan nha tho 02',
                    topicId: 'MainGroup01.SubGroup02',
                    status: false,
                },
                {
                    name: 'Tin nhan nha tho 03',
                    topicId: 'MainGroup01.SubGroup03',
                    status: false,
                }
            ]
        },
        {
            name: 'Tin nhan chung cua TNTT',
            topicId: 'MainGroup02',
            expanded: false,
            subItems: [
                {
                    name: 'Tin nhan cua TNTT 01',
                    topicId: 'MainGroup02.SubGroup01',
                    status: false,
                },
                {
                    name: 'Tin nhan cua TNTT 02',
                    topicId: 'MainGroup02.SubGroup02',
                    status: false,
                },
                {
                    name: 'Tin nhan cua TNTT 03',
                    topicId: 'MainGroup02.SubGroup03',
                    status: false,
                }
            ]
        }
    ];

    constructor(private fcm: FcmService, private logger: NGXLogger) {
    }

    public getTopicGroups() {
        return this.groups;
    }

    public saveSubscriptions() {
        for (let group of this.groups) {
            for (let item of group.subItems) {
                if (!item.status) {
                    continue;
                }

                this.logger.debug(`subscribing to topic ${item.topicId}`);
                this.fcm.subscribeToTopic(item.topicId);
            }
        }
    }

    public tongleGroupExpansion(parentGroup: any) {
        parentGroup.expanded = !parentGroup.expanded;
    }

    public checkboxGroupClicked(parentGroup: any) {
        this.logger.debug(`checkbox name ${parentGroup.name}`);
        for (let item of parentGroup.subItems) {
            item.status = parentGroup.status;
            this.logger.debug(`sub-item status ${item.status}`);
        }
    }

    public checkboxItemClicked(parentGroup: any, item: any) {
        this.logger.debug(`group name ${parentGroup.name} checkbox name ${item.name}`);
        let tmp = true;
        for (let sitem of parentGroup.subItems) {
            tmp = tmp && sitem.status;
            this.logger.debug('sub-item name ' + sitem.name + ' sub-item status ' + sitem.status + ' new group status ' + tmp);
        }
        parentGroup.status = tmp;
    }

}
