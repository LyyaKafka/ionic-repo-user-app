import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/storage.service';
import { User } from 'src/app/shared/storageprop';
import { AuthService } from 'src/app/shared/auth.service';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from './edit-profile/edit-profile.page';
import { EditPassPage } from './edit-pass/edit-pass.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: User;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private modalController: ModalController
  ) {
    // console.log(this.userData)
  }

  ngOnInit() {
    this.userData = this.authService.getUserLocalStorage();
  }

  async changeName() {
    const modal = await this.modalController.create({
      component: EditProfilePage,
      componentProps: {
        userData: this.userData,
      },
    });
    modal.present();
  }

  async changePass() {
    const modal = await this.modalController.create({
      component: EditPassPage,
      componentProps: {
        userData: this.userData,
      },
    });
    modal.present();
  }
}
