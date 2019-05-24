import {Injectable} from '@angular/core';
import {Firebase} from '@ionic-native/firebase/ngx';
import {ToastController} from '@ionic/angular';
import {Observable} from 'rxjs';

import {Storage} from '@ionic/storage';
import {FcmNotification} from '../model/fcmnotification.model';

@Injectable({
    providedIn: 'root'
})
export class FcmService {
    public static NOTIFICATION_PREFIX: string = 'notifications-';
    private currentToken: string = null;

    constructor(private firebase: Firebase,
                private storage: Storage,
                private toastController: ToastController) {
        this.setup();
    }

    private setup() {
        console.log('calling fcmService setup ');
        this.firebase.onTokenRefresh().subscribe(newToken => {
            console.log('got token ' + newToken);

            this.firebase.onNotificationOpen().subscribe(this.saveNotification);
        });
    }

    public getCurrentToken() {
        return this.currentToken;
    }

    public subscribeToTopic(topic: string) {
        // if (this.currentToken == null) {
        //   console.log("subscribeToTopic: this.currentToken is null")
        //   return; // should show a modal of issue
        // }

        this.firebase.subscribe(topic).then(good => {
                console.log('subscribeToTopic: good ' + good);
            },
            bad => {
                console.log('subscribeToTopic: bad ' + bad);
            });
    }

    public unsubscribeFromTopic(topic: string) {
        this.firebase.unsubscribe(topic).then(good => {
                console.log('unsubscribeFromTopic: good ' + good);
            },
            bad => {
                console.log('unsubscribeFromTopic: bad ' + bad);
            });
    }


    public async getKeys() {
        return await this.storage.keys();
    }

    public getSavedNotifications(): Observable<FcmNotification[]> {
        return new Observable(observer => {
            let ret: FcmNotification[] = [];
            this.storage.forEach((value: string, key: string, index: number) => {
                if (key.startsWith(FcmService.NOTIFICATION_PREFIX)) {
                    // console.log(key + " => " + value);
                    let item = <FcmNotification>JSON.parse(value);
                    ret.push(item);
                } else {
                    console.log(key + ' [other => ]' + value);

                }
            }).then(() => {
                observer.next(ret);
            });
            return {
                unsubscribe() {
                }
            };
        });
    }

    public onNotificationOpen() {
        return this.firebase.onNotificationOpen();
    }

    public saveNotification(msg: any) {
        let receivedTime = new Date(Date.now());
        let myNotification: FcmNotification = {
            key: FcmService.NOTIFICATION_PREFIX + receivedTime,
            receivedTime: receivedTime,
            msg: JSON.stringify(msg)
        };

        console.log(`got msg inside FcmService ${myNotification.msg}`);
        return this.storage.set(myNotification.key, JSON.stringify(myNotification));
    }

    public deleteNotification(msgKey: string): Promise<void> {
        return this.storage.remove(msgKey);
    }

}
