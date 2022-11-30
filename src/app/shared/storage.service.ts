import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Firestore,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  documentId,
  setDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

import { User, UserDoc, Document } from './storageprop';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // getUser(): Observable<User[]> {
  //   const userRef = collection(this.firestore, 'users');
  //   return collectionData(userRef, { idField: 'uid' }) as Observable<User[]>;
  // }

  // ----------------------------

  getUserById(uid: string): Observable<User> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return docData(userDocRef, { idField: 'uid' }) as Observable<User>;
  }

  async addCurrentUser(username: string, email: string, userid: any) {
    const userRef = doc(this.firestore, 'users', userid);
    return await setDoc(userRef, { username: username, email: email }).catch(
      (Error) => {
        console.log(
          'Something went wrong with added user to firestore: ',
          Error
        );
      }
    );
  }

  async updateUser(user: User, userid: string) {
    const userDocRef = doc(this.firestore, `users/${userid}`);
    return await updateDoc(userDocRef, {
      username: user.username,
      email: user.email,
    });
  }

  deleteUser(user: User) {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return deleteDoc(userDocRef);
  }

  // -----------------------------------------------

  async getDocumentById(id: string) {
    const docRef = await doc(this.firestore, `documents/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Document>;
  }

  async getDocumentsByUserId(uid: string) {
    const q = query(
      collection(this.firestore, 'documents'),
      where('ownerid', '==', uid)
    );
    const snapshot = await getDocs(q);
    return snapshot;
  }

  // async getDocuments(): Observable<Document[]>{
  //   const docRef = await collection(this.firestore, 'documents');
  //   return collectionData(docRef, { idField: 'id' }) as Observable<Document[]>;
  // }

  async getDocuments() {
    const q = query(
      collection(this.firestore, 'documents'),
      where('visibility', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot;
  }

  async addUserDocument(userdoc: UserDoc, ownerUid: string) {
    const userDocRef = collection(this.firestore, `users/${ownerUid}/userdoc`);
    return await addDoc(userDocRef, userdoc);
  }

  async addDocument(document: Document): Promise<Boolean> {
    const docRef = await addDoc(
      collection(this.firestore, 'documents'),
      document
    );

    const userDocRef = this.addUserDocument(
      { documentid: docRef.id },
      document.ownerid
    );

    if (docRef !== null && userDocRef !== null) {
      console.log('New Document Created');
      return true;
    } else {
      console.log('There Seems To Be A Problem Document');
      return false;
    }
  }

  updateDocument(document: Document, docId: string) {
    const docRef = doc(this.firestore, `documents/${docId}`);
    return updateDoc(docRef, {
      title: document.title,
      url: document.url,
      kategori: document.kategori,
      visibility: document.visibility,
      ownerid: document.ownerid,
    });
  }

  deleteDocument(docId: string) {
    const docRef = doc(this.firestore, `documents/${docId}`);
    return deleteDoc(docRef);
  }

  // ----------------------------------
}
