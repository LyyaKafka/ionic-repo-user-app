import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  currentUserUsername: string;
  currentUserEmail: string;

  public appPages = [
    { title: 'Home', url: '/', icon: 'home' },
    { title: 'Profile', url: '/profile', icon: 'person' },
    { title: 'Document', url: '/document', icon: 'documents' },
    // { title: 'Logout', url: '/logout', icon: 'log-out' },
  ];


  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    ) {
      this.currentUserUsername = localStorage.getItem('CurrentUsername');
      this.currentUserEmail = localStorage.getItem('CurrentUserEmail');
    }


  async logout() {
    const alert = await this.alertController.create({
      header: "Are You Sure ?",
      buttons: [
        {
          text: 'Yes',
          role: 'true',
        },
        {
          text: 'No',
          role: 'false',
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss().then(async ({role}) => {
      if(role === 'true'){
        await this.authService.logout();
		    this.router.navigateByUrl('/sign-in', { replaceUrl: true });
      }
    });
  }
}
