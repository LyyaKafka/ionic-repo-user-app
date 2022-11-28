import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateDocumentPage } from './create-document.page';

const routes: Routes = [
  {
    path: '',
    component: CreateDocumentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateDocumentPageRoutingModule {}
