import {Component, Input} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ModalController, Platform} from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import {BackendService} from '../../services/backend.service';

@Component({
    templateUrl: 'login.page.html',
    selector: 'loginModal'
})
export class LoginModal {
    failedReason: any = null;
    showPassword = false;
    waiting = false;
    fingerprintAIOAvailable = false;

    userEmail: string;
    password: string;

    constructor(private modalController: ModalController,
                private firebaseAuth: AngularFireAuth,
                private backendService: BackendService,
                private platform: Platform,
                private faio: FingerprintAIO) {
        this.platform.ready().then(() => {
            this.faio.isAvailable().then(() => {
                    this.failedReason = 'FingerprintAIO is available';
                    this.fingerprintAIOAvailable = true;
                }
            ).catch(reason => {
                this.failedReason = reason;
            });
        });
    }

    public cancel() {
        return this.modalController.dismiss();
    }

    public onPasswordToggle() {
        this.showPassword = !this.showPassword;
    }

    public hasRequiredData(): boolean {
        return this.userEmail != null && this.userEmail.trim().length > 0 && this.password != null && this.password.trim().length > 0;
    }

    public showFingerprintAIO() {
        this.faio.show({
            disableBackup: false
        })
            .then((result: any) => console.log(result))
            .catch((error: any) => console.log(error));
    }

    public login() {
        this.failedReason = null;
        this.waiting = true;
        this.firebaseAuth.auth.signInWithEmailAndPassword(this.userEmail, this.password)
        .then(userCredential => {
            const user = this.firebaseAuth.auth.currentUser;
            if (!user.emailVerified) {
                this.failedReason = 'Please check your email then confirm by clicking the verification link in the email.';
                this.firebaseAuth.auth.currentUser.sendEmailVerification().finally(() => {
                    this.waiting = false;
                    return;
                });
            }
            user.getIdToken(false).then(idToken => {
                this.backendService.authorizeUser(this.userEmail, idToken).subscribe(authorizationResult => {
                    if (authorizationResult['accessToken'] === '') {
                        this.failedReason = authorizationResult['failedReason'];
                        return;
                    }
                    return this.modalController.dismiss({
                        'userEmail': this.userEmail,
                        'idToken': idToken,
                        'accessToken': authorizationResult['accessToken']
                    });
                });
            })
            .catch(failedReason => {
                this.failedReason = failedReason['message'];
                return;
            })
            .finally(() => {
                this.waiting = false;
            });

        })
        .catch(failedReason => {
            this.failedReason = failedReason['message'];
            return;
        })
        .finally(() => {
            this.waiting = false;
        });
    }
}
