import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchTicketPageRoutingModule } from './search-ticket-routing.module';

import { SearchTicketPage } from './search-ticket.page';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchTicketPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [SearchTicketPage],
})
export class SearchTicketPageModule {}
