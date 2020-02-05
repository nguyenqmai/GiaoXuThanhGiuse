import {Component, Input} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ModalController, ToastController} from '@ionic/angular';
import {BackendService} from '../../services/backend.service';

@Component({
    templateUrl: 'changePassword.page.html',
    selector: 'changePasswordModal'
})
export class ChangePasswordModal {
    failedReason: any = null;
    showPassword = false;
    waiting = false;

    password: string;
    confirmPassword: string;

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

    public checkMatchingValues() {
        if (this.password && this.password.trim().length > 0 && this.confirmPassword && this.confirmPassword.trim().length > 0 && this.password !== this.confirmPassword) {
            this.failedReason = `Your password and confirmation password do not match.`;
        } else {
            this.failedReason = null;
        }
    }

    public hasRequiredData(): boolean {
        return this.password && this.password.trim().length > 0 && this.confirmPassword && this.password === this.confirmPassword;
    }

    submit() {
        this.failedReason = null;
        this.waiting = true;
        this.firebaseAuth.auth.currentUser.updatePassword(this.password).then(async () => {
            await this.presentToast(`Password changed successfully!`);
            return this.modalController.dismiss();
        })
        .catch(async (failedReason) => {
            await this.presentToast(`For security purpose, please logout, then login before changing your password.`);
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
