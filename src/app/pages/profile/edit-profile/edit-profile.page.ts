import { Component, OnInit, Input } from '@angular/core';
import { Document, User } from 'src/app/shared/storageprop';
import {
  ModalController,
  AlertController,
  ToastController,
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
    private fb: FormBuilder
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

  changeName() {
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
        const toast = await this.toastCtrl.create({
          message: 'New Name Successfully Changed',
          duration: 2000,
        });
        toast.present();
        this.authService.startUserLocalStorage();
        setTimeout(() => {
          this.dismissModal();
          window.location.reload(); // reloading look bad
        }, 2000);
      })
      .catch(async (Err) => {
        const toast = await this.toastCtrl.create({
          message: 'There Seems To Be A Problem With The System',
          duration: 2000,
        });
        toast.present();
        console.log(Err);
      });
  }
}
