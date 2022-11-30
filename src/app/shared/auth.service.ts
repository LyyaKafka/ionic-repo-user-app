import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
} from '@angular/fire/auth';
import { StorageService } from './storage.service';
import { User } from './storageprop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private storageService: StorageService) {}

  get currentUserId() {
    try {
      return this.auth.currentUser?.uid;
    } catch (error) {
      console.log('Something went wrong current user', Error);
      return null;
    }
  }

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/firebase.User
  //     const uid = user.uid;
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });

  startUserLocalStorage() {
    this.storageService.getUserById(this.currentUserId).subscribe((res) => {
      localStorage.setItem('CurrentUserUID', res.uid);
      localStorage.setItem('CurrentUsername', res.username);
      localStorage.setItem('CurrentUserEmail', res.email);
    });
  }

  getUserLocalStorage(): User {
    let user: User;
    try {
      user = {
        uid: localStorage.getItem('CurrentUserUID'),
        username: localStorage.getItem('CurrentUsername'),
        email: localStorage.getItem('CurrentUserEmail'),
      };
    } catch (error) {
      localStorage.removeItem('CurrentUserUID');
      localStorage.removeItem('CurrentUsername');
      localStorage.removeItem('CurrentUserEmail');
      this.startUserLocalStorage();
      return this.getUserLocalStorage();
    }
    return user;
  }

  async reauthenticate(currentPassword: string) {
    var user = this.auth.currentUser;
    var cred = EmailAuthProvider.credential(user.email, currentPassword);
    return await reauthenticateWithCredential(user, cred);
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.reauthenticate(currentPassword)
      .then(async () => {
        var user = this.auth.currentUser;
        await updatePassword(user, newPassword)
          .then(() => {
            console.log('Password updated!');
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async register({ username, email, password }: any) {
    const user = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    )
      .then(() => {
        this.storageService.addCurrentUser(username, email, this.currentUserId);
      })
      .catch((Error) => {
        /*
                            FirebaseError: Firebase: Error (auth/email-already-in-use).

                            error needed to fix, somehow the app work but still throw the damn error
                            */
        console.log('Something went wrong with sign up: ', Error);
      });
  }

  async login({ email, password }: any) {
    try {
      const user = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      ).catch((Error) => {
        console.log('Something went wrong with sign up: ', Error);
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  logout() {
    console.log(`${this.auth.currentUser?.email} is logged out`);
    localStorage.clear();
    return signOut(this.auth);
  }
}
