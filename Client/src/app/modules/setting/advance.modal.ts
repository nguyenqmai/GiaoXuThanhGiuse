import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AlertController, ModalController} from '@ionic/angular';
import {BackendService} from '../../services/backend.service';
import {OverlayEventDetail} from "@ionic/core";

@Component({
    templateUrl: 'advance.page.html',
    selector: 'advanceModal'
})
export class AdvanceModal implements OnInit {
    failedReason: any = null;
    waiting = false;
    selectedBackEndUrl: string;
    backendServerUrls: string[];

    constructor(private modalController: ModalController,
                private alertController: AlertController,
                private backendService: BackendService) {
    }

    async ngOnInit() {
        this.backendServerUrls = this.backendService.getAvailableUrlPrefixes();
        this.selectedBackEndUrl = this.backendService.getCurrentUrlPrefix();
    }

    public cancel() {
        return this.modalController.dismiss();
    }

    public switchBackendServerUrl() {
        this.backendService.updateUrlPrefix(this.selectedBackEndUrl);
    }

    async clearStorage() {
        const alert = await this.alertController.create({
            message: 'Delete all data of this app?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        alert.dismiss();
                        return false;
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        alert.dismiss(true);
                        return false;
                    }
                }
            ]
        });
        alert.onDidDismiss().then((detail: OverlayEventDetail) => {
            if (detail.data) {
                this.backendService.clearStorage();
            }
        });
        await alert.present();
    }
}
