import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatoreAreaPageRoutingModule } from './operatore-area-routing.module';

import { OperatoreAreaPage } from './operatore-area.page';
import { SharedComponentsModule } from './../shared-components/shared-components.module';
import { TicketsDataService } from '../services/tickets-data.service';

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    IonicModule,
    OperatoreAreaPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [OperatoreAreaPage],
  providers:[TicketsDataService]
})
export class OperatoreAreaPageModule {}
