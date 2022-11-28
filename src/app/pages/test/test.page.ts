import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/storageprop';
import { StorageService } from 'src/app/shared/storage.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {}

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  foo1() {
    const username: string = 'temp name';
    const email: string = 'temp email';

    const reso = this.storageService.addCurrentUser(
      username,
      email,
      this.authService.currentUserId
    );
    console.log(reso);
  }

  foo2() {
    let currPass = '1234567';
    let newPass = '123456';
    this.authService.changePassword(currPass, newPass);
  }
}
