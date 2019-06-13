import {Component} from '@angular/core';
import {OverlayEventDetail} from '@ionic/core';
import {Platform, ToastController} from '@ionic/angular';

import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AlertController } from '@ionic/angular';
import {FcmService} from './services/fcm.service';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    private currentFCMToken: string;

    constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        private fcm: FcmService,
        private splashScreen: SplashScreen,
        private alertController: AlertController,
        private toastController: ToastController, 
        private logger: NGXLogger
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            if(this.platform.is('android')) {
                this.androidSetup();
            } else {
                this.statusBar.styleDefault();
            }
            this.splashScreen.hide();
            this.notificationSetup();
        });
    }


    private async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            position: 'top',
            showCloseButton: true,
            duration: 10000
        });
        toast.present();
    }

    private async presentAlert() {
        const alert = await this.alertController.create({
            message: 'Exit app?',
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
                navigator['app'].exitApp();
            }
        })

        await alert.present();

    }

    private notificationSetup() {
        this.fcm.onNotificationOpen().subscribe((msg: any) => {
            this.logger.info(`got msg inside app.components.ts ${JSON.stringify(msg)}`);
            this.fcm.saveNotification(msg);
        });
    }

    private androidSetup() {
        this.statusBar.styleLightContent();
        this.platform.backButton.subscribeWithPriority(0, () => {
            // this.presentToast(`window.location.pathname ${window.location.pathname}`);
            this.logger.info(`window.location.pathname ${window.location.pathname}`);
            this.presentAlert();
          });
    }


}
