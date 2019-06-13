import {Component} from '@angular/core';
import {EventGroup} from "../../model/eventgroup.model";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    private eventGroups: EventGroup[] = [
        {
            displayName: 'Office Hours',
            order: 0,
            expanded: false,
            events: [
                {name: 'Tuesday - Friday', occurrences: ['9:00 AM - 5:00PM'], note: null, contactIds:[]},
                {name: 'Saturday - Sunday', occurrences: ['9:00 AM - 1:00PM'], note: null, contactIds:[]},
                {name: 'Monday', occurrences: ['Closed'], note: null, contactIds:[]}
            ]
        },
        {
            displayName: 'Mass Schedule',
            order: 100,
            expanded: false,
            events: [
                {name: 'Tuesday - Friday', occurrences: ['6:00PM'], note: 'Mass in Vietnamese', contactIds:[]},
                {name: 'Saturday Vigil', occurrences: ['6:30PM'], note: 'Mass in Vietnamese', contactIds:[]},
                {name: 'Sunday', occurrences: ['8:30 AM', '10:30 AM'], note: 'Mass in Vietnamese', contactIds:[]},
                {name: 'Sunday', occurrences: ['12:30 PM'], note: 'Mass in English', contactIds:[]}
            ]
        },
        {
            displayName: 'Reconciliation/Confession',
            order: 200,
            expanded: false,
            events: [
                {name: 'Tuesday - Saturday', occurrences: ['5:00PM - 5:45PM'], note: 'Or by appointment', contactIds:[]},
                {name: 'Last Sunday of the month', occurrences: ['1:45PM'], note: 'After 12:30 PM Mass', contactIds:[]},
                {name: 'Advent and Lent', occurrences: ['TBD'], note: 'Please see announcements', contactIds:[]},
            ]
        },
        {
            displayName: 'Sacraments',
            order: 300,
            expanded: false,
            events: [
                {name: 'Baptism', occurrences: [], note: 'First Saturday of the month at: 8:30AM and 12:00PM', contactIds:['Parish office: (704) 504-0907']},
                {name: 'Matrimony', occurrences: [], note: 'Please contact our office at least 6 months prior to the wedding date', contactIds:['Parish office: (704) 504-0907']},
                {name: 'Annointing of the sick', occurrences: [], note: null, contactIds:['Pastor: (704) 277-0267']},
            ]
        },
    ];

    getEventGroups(): EventGroup[] {
        return this.eventGroups;
    }

    public tongleGroupExpansion(group: EventGroup) {
        group.expanded = !group.expanded;
    }

}
