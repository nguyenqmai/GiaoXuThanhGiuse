import {Component} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    private groups = [
        {
            label: 'Tin nhan chung cua nha tho',
            note: '',
            expanded: false,
            subItems: [
                {
                    label: 'Tin nhan nha tho 01',
                    note: '',
                },
                {
                    name: 'Tin nhan nha tho 02',
                    note: '',
                },
                {
                    name: 'Tin nhan nha tho 03',
                    note: '',
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
}
