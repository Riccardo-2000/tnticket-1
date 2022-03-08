import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyUserProfilePage } from './modify-user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyUserProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyUserProfilePageRoutingModule {}
