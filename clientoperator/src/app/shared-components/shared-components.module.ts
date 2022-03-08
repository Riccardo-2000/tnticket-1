import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';

import { ModalAddCustomerComponent } from './../components/modal-add-customer/modal-add-customer.component';
import { HeaderComponent } from '../components/header/header.component';
import { TabsComponent } from '../components/tabs/tabs.component';
import { TicketsModalComponent } from '../components/tickets-modal/tickets-modal.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ModifyCustomerDataComponent } from '../components/modify-customer-data/modify-customer-data.component';
import { ModifyTicketDataComponent } from '../components/modify-ticket-data/modify-ticket-data.component';
import { ModalTicketByCustomerComponent } from '../components/modal-ticket-by-customer/modal-ticket-by-customer.component';
import { TicketSliderComponent } from '../components/ticket-slider/ticket-slider.component';
import { TicketListComponent } from '../components/ticket-list/ticket-list.component';
import { ImageCustomerSliderComponent } from './../components/image-customer-slider/image-customer-slider.component';

import { PadSignatureComponent } from '../ticket/pad-signature/pad-signature.component';
import { SignaturePadModule } from 'ngx-signaturepad';
import { ModalCloneTicketComponent } from '../components/modal-clone-ticket/modal-clone-ticket.component';

@NgModule({
    declarations: [
        HeaderComponent,
        TabsComponent,
        TicketsModalComponent,
        ModalAddCustomerComponent,
        ModifyCustomerDataComponent,
        ModifyTicketDataComponent,
        ModalCloneTicketComponent,
        ModalTicketByCustomerComponent,
        TicketSliderComponent,
        TicketListComponent,
        ImageCustomerSliderComponent,
        PadSignatureComponent
    ],
    imports: [

        IonicModule,
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SignaturePadModule
    ],

    exports:[
        HeaderComponent,
        TabsComponent,
        TicketsModalComponent,
        ModalAddCustomerComponent,
        ModifyCustomerDataComponent,
        ModifyTicketDataComponent,
        ModalTicketByCustomerComponent,
        TicketSliderComponent,
        TicketListComponent,
        ImageCustomerSliderComponent,
        PadSignatureComponent
    ]
})
export class SharedComponentsModule { }
