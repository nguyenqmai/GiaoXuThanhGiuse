import {Component} from '@angular/core';
import {FcmService} from '../../services/fcm.service';

@Component({
    selector: 'notifications',
    templateUrl: 'abc.component.html'
})
export class AbcComponent {

    constructor(private fcmService: FcmService) {
    }

    public getAllNotifications() {
        // return this.fcmService.getSavedNotifications();
        return [];
    }
}
