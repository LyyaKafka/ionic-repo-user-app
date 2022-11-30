import { Component, OnInit, Input } from '@angular/core';
import { Document, User } from 'src/app/shared/storageprop';
import {
  ModalController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/storage.service';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() document: Document;
  @Input() userData: User;

  documentUser: User;

  // download link in html
  downloadLink: any;
  filename: any;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService,
    private toastCtrl: ToastController,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.storageService.getUserById(this.document.ownerid).subscribe((res) => {
      this.documentUser = res;
    });

    this.downloadDocument();
  }

  get documentVisibility() {
    return this.document.visibility ? 'Public' : 'Private';
  }

  get isDocumentMadeByCurrentUser() {
    return this.document.ownerid === this.userData.uid;
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  toEdit() {
    this.router.navigate(['document/edit-document', this.document.id]);
    this.dismissModal();
  }

  async deleteDocument() {
    const alert = await this.alertController.create({
      header: 'Are You Sure You Want to Delete The Document',
      buttons: [
        {
          text: 'Confirm',
          role: 'Confirm',
        },
        {
          text: 'Cancel',
          role: 'Cancel',
        },
      ],
    });
    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (role === 'Confirm') {
      console.log('delete');
      this.storageService
        .deleteDocument(this.document.id)
        .then(async () => {
          const toast = await this.toastCtrl.create({
            message: 'Document Successfully Deleted',
            duration: 2000,
          });
          toast.present();
          this.dismissModal();
          window.location.reload(); // reloading look bad
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

  // cors json in root folder
  async downloadDocument() {
    const storageRef = ref(this.storage, this.document.url);
    this.filename = this.document.url.split('/')[2];
    console.log(storageRef);
    console.log(this.filename);

    const dw = await getDownloadURL(storageRef);
    console.log(dw);
    this.downloadLink = dw;
  }
}
