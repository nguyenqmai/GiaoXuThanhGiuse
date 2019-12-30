import {Component, Input} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {TopicNode} from "../../model/topicnode.model";
import {BackendService} from "../../services/backend.service";
import {AngularFireAuth} from "@angular/fire/auth";


@Component({
    templateUrl: 'login.page.html',
    selector: 'loginModal'
})
export class LoginModal{
    @Input() topic: TopicNode;

    failedReason: any = null;
    showPassword: boolean = false;
    waiting: boolean = false;

    userEmail: string;
    password: string;

    constructor(private modalController: ModalController,
                private firebaseAuth: AngularFireAuth,
                private backendService: BackendService) {
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

    public login() {
        this.failedReason = null;
        this.waiting = true;
        this.firebaseAuth.auth.signInWithEmailAndPassword(this.userEmail, this.password)
        .then(userCredential => {
            let user = this.firebaseAuth.auth.currentUser;
            if (!user.emailVerified) {
                this.failedReason = "Please check your email then confirm by clicking the verification link in the email."
                this.firebaseAuth.auth.currentUser.sendEmailVerification().finally(() => {
                    this.waiting = false;
                    return;
                })
            } else {
                user.getIdToken(false)
                .then(idToken => {
                    this.backendService.authorizeUser(this.userEmail, idToken).subscribe(authorizationResult => {
                        if (authorizationResult["accessToken"] == "") {
                            this.failedReason = authorizationResult["failedReason"];
                            return;
                        }
                        return this.modalController.dismiss({
                            'userEmail': this.userEmail,
                            'idToken': idToken,
                            'accessToken': authorizationResult["accessToken"]
                        });
                    });
                })
                .catch(failedReason => {
                    this.failedReason = failedReason['message'];
                    return;
                })
                .finally(() => {
                    this.waiting = false;
                })
            }
        })
        .catch(failedReason => {
            this.failedReason = failedReason['message'];
            return;
        })
        .finally(() => {
            this.waiting = false;
        })
    }
}
