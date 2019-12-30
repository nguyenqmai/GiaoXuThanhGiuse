import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {EventInfo} from "../../model/eventinfo.model";
import {forkJoin, Observable, of, timer} from "rxjs";
import {NGXLogger} from "ngx-logger";
import {catchError} from "rxjs/operators";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    waiting: boolean = false;
    frontPageGroups: EventInfo[] = [];

    constructor(private logger: NGXLogger, private backend: BackendService) {
    }

    ngOnInit() {
        this.loadData();
    }

    doRefresh(event) {
        this.logger.debug('Begin async operation');
        this.loadData();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 1000);
    }

    // getEventInfos(): EventInfo[] {
    //     return this.frontPageGroups;
    // }

    public tongleGroupExpansion(group: EventInfo) {
        this.logger.debug('Inside tongleGroupExpansion');
        group.expanded = !group.expanded;
        let delta = Date.now() - group.lastUpdated

        if (delta/1000/60 > 30) { // update every 40 minutes
            this.refreshEventInfo(group);
        } else {
            this.logger.debug('No need to refresh data');
        }
    }

    public refreshEventInfo(group: EventInfo) {
        this.logger.debug('Need to refresh data');
        this.backend.getEventInfo(group.id).subscribe(event => {
            for (var index in this.frontPageGroups) {
                if (this.frontPageGroups[index].id == event.id) {
                    this.frontPageGroups[index] = event;
                    break;
                }
            }
        })
    }

    private retrieveEventInfo(dataType: string, backendFunction: Observable<EventInfo>) {
        this.logger.info("Retrieving data of ", dataType)
        this.waiting = true;
        backendFunction.subscribe(eventInfo => {
            this.logger.info("Got data for ", dataType)
            eventInfo.lastUpdated = Date.now();
            this.frontPageGroups.push(eventInfo);
            this.frontPageGroups.sort((a,b) => { return a.displayOrder - b.displayOrder});
            this.waiting = false
        }, error => {
            this.logger.info("Got error while retrieving ", dataType, error)
            this.waiting = false
        })
    }

    public loadData() {
        this.frontPageGroups.splice(0, this.frontPageGroups.length);
        this.retrieveEventInfo("OfficeHours", this.backend.getOfficeHours());
        this.retrieveEventInfo("MassSchedule", this.backend.getMassSchedule());
        this.retrieveEventInfo("ConfessionSchedule", this.backend.getConfessionSchedule());

        setTimeout(() => {
            this.logger.debug('refreshAllNotifications spinning has ended');
            this.waiting = false
        }, 200);
    }
}
