import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketPageRoutingModule } from './ticket-routing.module';

import { TicketPage } from './ticket.page';
import { SharedComponentsModule } from '../shared-components/shared-components.module';


@NgModule({
  imports: [
  CommonModule,
    FormsModule,
    IonicModule,
    TicketPageRoutingModule,
    SharedComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [TicketPage]
})
export class TicketPageModule {}
