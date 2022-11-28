import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/shared/storage.service';
import { User, Document } from 'src/app/shared/storageprop';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { ExtraService } from 'src/app/shared/extra.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { HttpClient } from '@angular/common/http';


import { ref, Storage, uploadBytes, StorageReference } from '@angular/fire/storage';
// import { ConnectableObservable } from 'rxjs';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.page.html',
  styleUrls: ['./create-document.page.scss'],
})
export class CreateDocumentPage implements OnInit {

	credentials: FormGroup;

  files: File;

  userData: User;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private extraService: ExtraService,

    private loadingController: LoadingController,
    private storage: Storage,
    private http: HttpClient,
    private fb: FormBuilder,

  ) {
    this.userData = this.authService.getUserLocalStorage();
  }

  get judulInput(){
    return this.credentials.get('judulInput');
  }

  get kategoriInput(){
    return this.credentials.get('kategoriInput');
  }

  get visibilitasInput(){
    return this.credentials.get('visibilitasInput');
  }

  get fileInput(){
    return this.credentials.get('fileInput');
  }


  ngOnInit() {
    this.credentials = this.fb.group({
      judulInput: ['', [Validators.required, Validators.minLength(10)]],
      kategoriInput: ['', [Validators.required, Validators.minLength(2)]],
      visibilitasInput: ['', [Validators.required], ],
      fileInput: ['', [Validators.required]]
		});
  }

  async createNewDocument(){

    // problem if theres two file that has the same name
    const storageRef = ref(this.storage,`/uploads/${this.userData.uid}/${this.files.name}`);

    const uploadResult = await this.uploadFile(this.files, storageRef).catch(() => {
      this.extraService.showAlert("there seems to be a problem while uploading doc");
    });

    // console.log(uploadResult);

    if (uploadResult !== null){

      const newDoc: Document = {
        title: this.judulInput.value,
        url: storageRef.fullPath,
        kategori: this.kategoriInput.value,
        visibility: ((this.visibilitasInput.value === 'false') ? false : true ),
        ownerid: this.userData.uid
      };

      // console.log(newDoc);

      await this.storageService.addDocument(newDoc).then((res) => {
        this.extraService.showAlert('Document Is Successfully Created').then(() => {
          this.router.navigateByUrl('/document').then(() => document.location.reload());
        });
        }).catch((error) => {
          this.extraService.showAlert("there seems to be a problem while storing data");
          console.log(error);
        });
    }
    else {
      this.extraService.showAlert("there seems to be a problem while uploading doc");
    }
  }

  async uploadFile(file: File, storageRef: StorageReference){
    const uploadTask = await uploadBytes(storageRef, file);
	  return uploadTask;
  }

  async selectFile(event: any){
    if(event != null){
      this.files = event.target.files[0];
    }else{
      console.log("File kosong");
    }
  }
}
