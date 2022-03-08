import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TecnicoAreaPage } from './tecnico-area.page';

const routes: Routes = [
  {
    path: '',
    component: TecnicoAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TecnicoAreaPageRoutingModule {}
