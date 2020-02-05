import {Component, Input} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ModalController, ToastController} from '@ionic/angular';
import {BackendService} from '../../services/backend.service';

@Component({
    templateUrl: 'resetPassword.page.html',
    selector: 'resetPasswordModal'
})
export class ResetPasswordModal {
    failedReason: any = null;
    showPassword = false;
    waiting = false;

    userEmail: string;

    constructor(private modalController: ModalController,
                private toastController: ToastController,
                private firebaseAuth: AngularFireAuth) {
    }

    public cancel() {
        return this.modalController.dismiss();
    }

    public onPasswordToggle() {
        this.showPassword = !this.showPassword;
    }

    public hasRequiredData(): boolean {
        return this.userEmail != null && this.userEmail.trim().length > 0;
    }

    public submit() {
        this.failedReason = null;
        this.waiting = true;
        this.firebaseAuth.auth.sendPasswordResetEmail(this.userEmail).then(async () => {
            await this.presentToast(`Reset Password email sent. Please check your mailbox.`);
            return this.modalController.dismiss();
        })
        .catch(async (failedReason) => {
            // await this.presentToast(failedReason['message']);
            this.failedReason = failedReason['message'];
            return;
        })
        .finally(() => {
            this.waiting = false;
        });
    }

    private async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            position: 'top',
            showCloseButton: true,
            duration: 5000
        });
        toast.present();
    }
}


