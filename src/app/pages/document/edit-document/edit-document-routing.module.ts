import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDocumentPage } from './edit-document.page';

const routes: Routes = [
  {
    path: '',
    component: EditDocumentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDocumentPageRoutingModule {}
