import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentPage } from './document.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentPage
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'edit-document/:id',
    loadChildren: () => import('./edit-document/edit-document.module').then( m => m.EditDocumentPageModule)
  },
  {
    path: 'create-document',
    loadChildren: () => import('./create-document/create-document.module').then( m => m.CreateDocumentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentPageRoutingModule {}
