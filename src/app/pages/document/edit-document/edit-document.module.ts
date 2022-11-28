import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDocumentPageRoutingModule } from './edit-document-routing.module';

import { EditDocumentPage } from './edit-document.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDocumentPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditDocumentPage]
})
export class EditDocumentPageModule {}
