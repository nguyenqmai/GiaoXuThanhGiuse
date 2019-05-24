import {Component} from '@angular/core';
import {FcmService} from '../../services/fcm.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})


export class Tab2Page {
    private groups = [
        {
            name: 'Tin nhan chung cua nha tho',
            topicId: 'MainGroup01',
            status: true,
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
            status: false,
            expanded: false,
            subItems: [
                {
                    name: 'Tin nhan cua TNTT 01',
                    topicId: 'MainGroup02.SubGroup01',
                    status: true,
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
        },
        {
            name: 'Tin nhan chung',
            topicId: 'MainGroup03',
            status: false,
            expanded: false,
        }
    ];

    constructor(private fcm: FcmService) {
    }

    public getTopicGroups() {
        return this.groups;
    }

    public tongleGroupExpansion(parentGroup: any) {
        parentGroup.expanded = !parentGroup.expanded;
    }

    public checkboxGroupClicked(parentGroup: any) {
        console.log('checkbox name ' + parentGroup.name);
        // if (parentGroup.status) {
        for (let item of parentGroup.subItems) {
            item.status = parentGroup.status;
            console.log('sub-item status ' + item.status);
        }
    }

    public showNotifications() {

    }
}
