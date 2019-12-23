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
    private enable: boolean = false;
    frontPageGroups: EventInfo[] = [];

    constructor(private logger: NGXLogger, private backend: BackendService) {
    }

    ngOnInit(): void {
        this.enable = false;
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

    getEventInfos(): EventInfo[] {
        return this.frontPageGroups;
    }

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

    public loadData() {
        forkJoin(this.backend.getOfficeHours(),
            this.backend.getMassSchedule(),
            this.backend.getConfessionSchedule()).subscribe(([officeHours, massSchedule, confessionSchedule]) => {
                officeHours.lastUpdated = Date.now();
                massSchedule.lastUpdated = Date.now();
                confessionSchedule.lastUpdated = Date.now();
                this.frontPageGroups.splice(0, this.frontPageGroups.length);
                this.frontPageGroups.push(officeHours, massSchedule, confessionSchedule);
                this.enable = true;
        })
    }
}
