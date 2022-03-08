import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatoreAreaPage } from './operatore-area.page';

const routes: Routes = [
  {
    path: '',
    component: OperatoreAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatoreAreaPageRoutingModule {}
