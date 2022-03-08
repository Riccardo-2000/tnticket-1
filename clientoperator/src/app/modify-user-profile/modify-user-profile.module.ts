import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyUserProfilePageRoutingModule } from './modify-user-profile-routing.module';

import { ModifyUserProfilePage } from './modify-user-profile.page';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    ModifyUserProfilePageRoutingModule
  ],
  declarations: [ModifyUserProfilePage]
})
export class ModifyUserProfilePageModule {}
