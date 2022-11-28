import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
// import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  constructor(
    private alertController: AlertController,
  ) { }

  async showAlert(header: string) {
    const alert = await this.alertController.create({
      header: header,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
        },
      ],
    });

    await alert.present();
    return await alert.onDidDismiss();
  }


  // WhiteSpaceValidator(control: AbstractControl) : ValidationErrors | null {
  //     if((control.value as string).indexOf(' ') >= 0){
  //         return {noWhiteSpace: true}
  //     }
  //   return null;
  // }
}
