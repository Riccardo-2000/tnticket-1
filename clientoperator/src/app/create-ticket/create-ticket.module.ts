import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormControl } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTicketPageRoutingModule } from './create-ticket-routing.module';

import { CreateTicketPage } from './create-ticket.page';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTicketPageRoutingModule,
    SharedComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [CreateTicketPage]
})
export class CreateTicketPageModule {}
