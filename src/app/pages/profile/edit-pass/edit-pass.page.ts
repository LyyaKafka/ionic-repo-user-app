import { Component, OnInit, Input } from '@angular/core';
import { Document } from 'src/app/shared/storageprop';
import {
  ModalController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { User } from '@angular/fire/auth';
import { StorageService } from 'src/app/shared/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { ExtraService } from 'src/app/shared/extra.service';

@Component({
  selector: 'app-edit-pass',
  templateUrl: './edit-pass.page.html',
  styleUrls: ['./edit-pass.page.scss'],
})
export class EditPassPage implements OnInit {
  @Input() userData: User;

  credentials: FormGroup;

  constructor(
    private modalController: ModalController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private extraService: ExtraService,
    private fb: FormBuilder,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get oldPassword() {
    return this.credentials.get('oldPassword');
  }

  get newPassword() {
    return this.credentials.get('newPassword');
  }

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async changePassword() {
    const loading = await this.loadingController.create();
    await loading.present();

    if (this.confirmPassword.value === this.newPassword.value) {
      try {
        this.authService.changePassword(
          this.oldPassword.value,
          this.newPassword.value
        );

        const toast = await this.toastCtrl.create({
          message: 'New Password Successfully Changed',
          duration: 1000,
        });
        toast.present();
        setTimeout(() => {
          this.dismissModal();
        }, 2000);
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'There Seems To Be A Problem With The System',
          duration: 2000,
        });
        toast.present();
      }

      await loading.dismiss();

      // do something
    } else {
      await loading.dismiss();

      this.extraService.showAlert('Confirmation Password isnt Similar');
    }
  }
}
