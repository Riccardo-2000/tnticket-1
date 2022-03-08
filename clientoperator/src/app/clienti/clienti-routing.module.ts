import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientiPage } from './clienti.page';

const routes: Routes = [
  {
    path: '',
    component: ClientiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientiPageRoutingModule {}
