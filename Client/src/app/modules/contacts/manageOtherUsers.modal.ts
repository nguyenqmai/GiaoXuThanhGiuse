import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    templateUrl: 'manageOtherUsers.page.html',
    selector: 'manageOtherUsersModal'
})
export class ManageOtherUsersModal implements OnInit {
    @Input() permissionsToggles: any[];

    failedReason: any = null;
    waiting = false;

    constructor(private modalController: ModalController) {
    }

    ngOnInit(): void {
    }


    toggleClicked(index: number) {
        // const found = this.permissionsToggles[index];
        // if (found) {
        //     found[2] = !found[2];
        // }
    }

    public submit() {
        this.failedReason = null;
        this.waiting = true;
        return this.modalController.dismiss(this.permissionsToggles);
    }
}

