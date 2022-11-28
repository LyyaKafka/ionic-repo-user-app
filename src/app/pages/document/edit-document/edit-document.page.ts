import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/storage.service';
import { User, Document } from 'src/app/shared/storageprop';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtraService } from 'src/app/shared/extra.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.page.html',
  styleUrls: ['./edit-document.page.scss'],
})
export class EditDocumentPage implements OnInit {
  docid: string;

  userData: User;
  currentDocument: Document;

  credentials: FormGroup;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private extraService: ExtraService,
    private fb: FormBuilder
  ) {
    this.userData = this.authService.getUserLocalStorage();
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      judulInput: ['', [Validators.required, Validators.minLength(10)]],
      kategoriInput: ['', [Validators.required, Validators.minLength(2)]],
      visibilitasInput: ['', [Validators.required]],
    });

    this.docid = this.activatedroute.snapshot.paramMap.get('id');
    this.storageService.getDocumentById(this.docid).then((res) => {
      res.subscribe((q) => {
        this.currentDocument = q;
        this.credentials.setValue({
          judulInput: q.title,
          kategoriInput: q.kategori,
          visibilitasInput: q.visibility ? 'true' : 'false',
        });
      });
    });
  }

  get judulInput() {
    return this.credentials.get('judulInput');
  }

  get kategoriInput() {
    return this.credentials.get('kategoriInput');
  }

  get visibilitasInput() {
    return this.credentials.get('visibilitasInput');
  }

  async editDocument() {
    const editDoc: Document = {
      title: this.judulInput.value,
      url: this.currentDocument.url,
      kategori: this.kategoriInput.value,
      visibility: this.visibilitasInput.value === 'false' ? false : true,
      ownerid: this.userData.uid,
    };

    console.log(editDoc);

    const res = this.storageService
      .updateDocument(editDoc, this.currentDocument.id)
      .then((res) => {
        this.extraService
          .showAlert('Document Is Successfully Edited')
          .then(() => {
            this.router
              .navigateByUrl('/document')
              .then(() => document.location.reload());
          });
      })
      .catch((error) => {
        this.extraService.showAlert(
          'there seems to be a problem while updating data'
        );
        console.log(error);
      });
  }
}
