import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientiPageRoutingModule } from './clienti-routing.module';

import { ClientiPage } from './clienti.page';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientiPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ClientiPage]
})
export class ClientiPageModule {}
