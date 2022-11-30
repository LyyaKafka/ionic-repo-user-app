import { Component, OnInit, Input } from '@angular/core';
import { Document, User } from 'src/app/shared/storageprop';
import {
  ModalController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { StorageService } from 'src/app/shared/storage.service';
import { AuthService } from 'src/app/shared/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  @Input() userData: User;
  credentials: FormGroup;

  constructor(
    private modalController: ModalController,
    private storageService: StorageService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private fb: FormBuilder,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() {
    return this.credentials.get('username');
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async changeName() {
    const loading = await this.loadingController.create();
    await loading.present();

    // console.log(this.newName, this.userData);
    this.storageService
      .updateUser(
        {
          username: this.username.value,
          email: this.userData.email,
        },
        this.userData.uid
      )
      .then(async () => {
        await loading.dismiss();

        const toast = await this.toastCtrl.create({
          message: 'New Name Successfully Changed',
          duration: 2000,
        });
        toast.present();
        this.authService.startUserLocalStorage();
        setTimeout(() => {
          this.dismissModal();
          this.userData = this.authService.getUserLocalStorage();
          setTimeout(() => window.location.reload(), 5000);
        }, 1000);
      })
      .catch(async (Err) => {
        await loading.dismiss();

        const toast = await this.toastCtrl.create({
          message: 'There Seems To Be A Problem With The System',
          duration: 2000,
        });
        toast.present();
        console.log(Err);
      });
  }
}
