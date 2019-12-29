import {Component} from '@angular/core';
import {MyFirebaseMsgService} from '../../services/myFirebaseMsgService';

@Component({
    selector: 'notifications',
    templateUrl: 'abc.component.html'
})
export class AbcComponent {

    constructor(private fcmService: MyFirebaseMsgService) {
    }

    public getAllNotifications() {
        // return this.fcmService.getSavedNotifications();
        return [];
    }
}
