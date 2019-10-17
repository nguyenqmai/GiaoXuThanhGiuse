import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventInfo} from "../../model/eventinfo.model";
import {forkJoin, timer} from "rxjs";
import {NGXLogger} from "ngx-logger";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    // private eventGroups: EventGroup[] = [
    //     {
    //         vietnameseName: 'Office Hours',
    //         order: 0,
    //         expanded: false,
    //         events: [
    //             {name: 'Tuesday - Friday', occurrences: ['9:00 AM - 5:00PM'], note: null, contactIds:[]},
    //             {name: 'Saturday - Sunday', occurrences: ['9:00 AM - 1:00PM'], note: null, contactIds:[]},
    //             {name: 'Monday', occurrences: ['Closed'], note: null, contactIds:[]}
    //         ]
    //     },
    //     {
    //         vietnameseName: 'Mass Schedule',
    //         order: 100,
    //         expanded: false,
    //         events: [
    //             {name: 'Tuesday - Friday', occurrences: ['6:00PM'], note: 'Mass in Vietnamese', contactIds:[]},
    //             {name: 'Saturday Vigil', occurrences: ['6:30PM'], note: 'Mass in Vietnamese', contactIds:[]},
    //             {name: 'Sunday', occurrences: ['8:30 AM', '10:30 AM'], note: 'Mass in Vietnamese', contactIds:[]},
    //             {name: 'Sunday', occurrences: ['12:30 PM'], note: 'Mass in English', contactIds:[]}
    //         ]
    //     },
    //     {
    //         vietnameseName: 'Reconciliation/Confession',
    //         order: 200,
    //         expanded: false,
    //         events: [
    //             {name: 'Tuesday - Saturday', occurrences: ['5:00PM - 5:45PM'], note: 'Or by appointment', contactIds:[]},
    //             {name: 'Last Sunday of the month', occurrences: ['1:45PM'], note: 'After 12:30 PM Mass', contactIds:[]},
    //             {name: 'Advent and Lent', occurrences: ['TBD'], note: 'Please see announcements', contactIds:[]},
    //         ]
    //     },
    //     {
    //         vietnameseName: 'Sacraments',
    //         order: 300,
    //         expanded: false,
    //         events: [
    //             {name: 'Baptism', occurrences: [], note: 'First Saturday of the month at: 8:30AM and 12:00PM', contactIds:['Parish office: (704) 504-0907']},
    //             {name: 'Matrimony', occurrences: [], note: 'Please contact our office at least 6 months prior to the wedding date', contactIds:['Parish office: (704) 504-0907']},
    //             {name: 'Annointing of the sick', occurrences: [], note: null, contactIds:['Pastor: (704) 277-0267']},
    //         ]
    //     },
    // ];

    private enable: boolean = false;
    frontPageGroups: EventInfo[] = [];

    constructor(private logger: NGXLogger, private backend: BackendService) {
    }

    ngOnInit(): void {
        this.enable = false;
        this.loadData();
    }

    doRefresh(event) {
        this.logger.log('Begin async operation');

        setTimeout(() => {
            this.logger.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

    getEventInfos(): EventInfo[] {
        return this.frontPageGroups;
    }

    public tongleGroupExpansion(group: EventInfo) {
        this.logger.log('Inside tongleGroupExpansion');
        group.expanded = !group.expanded;
        let delta = Date.now() - group.lastUpdated

        if (delta/1000/60 > 30) { // update every 40 minutes
            this.refreshEventInfo(group);
        } else {
            this.logger.log('No need to refresh data');
        }
    }

    public refreshEventInfo(group: EventInfo) {
        this.logger.log('Need to refresh data');
        this.backend.getEventInfo(group.id).subscribe(event => {
            for (var index in this.frontPageGroups) {
                if (this.frontPageGroups[index].id == event.id) {
                    this.frontPageGroups[index] = event;
                    break;
                }
            }
        })
    }

    private loadData() {
        forkJoin(this.backend.getOfficeHours(),
            this.backend.getMassSchedule(),
            this.backend.getConfessionSchedule()).subscribe(([officeHours, massSchedule, confessionSchedule]) => {
                officeHours.lastUpdated = Date.now();
                massSchedule.lastUpdated = Date.now();
                confessionSchedule.lastUpdated = Date.now();
                this.frontPageGroups.push(officeHours, massSchedule, confessionSchedule);
                this.enable = true;
        })
    }
}
