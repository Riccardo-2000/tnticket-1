import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TecnicoAreaPageRoutingModule } from './tecnico-area-routing.module';

import { TecnicoAreaPage } from './tecnico-area.page';

import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  imports: [

  CommonModule,
    FormsModule,
    IonicModule,
    TecnicoAreaPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [TecnicoAreaPage]
})
export class TecnicoAreaPageModule {}
