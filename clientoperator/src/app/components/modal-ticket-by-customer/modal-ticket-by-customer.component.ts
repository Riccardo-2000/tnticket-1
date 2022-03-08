import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { CustomersService } from './../../services/customers.service';

@Component({
    selector: 'app-modal-ticket-by-customer',
    templateUrl: './modal-ticket-by-customer.component.html',
    styleUrls: ['./modal-ticket-by-customer.component.scss'],
})
export class ModalTicketByCustomerComponent implements OnInit {
    @Input() id: string;

    //Controller Tickets
    existedTicket:Boolean = true;
    customerData:any;
    ticketsByCustomer:any;


    //=> Operator for ticket
    operator:any;
    constructor(private modalCrtl : ModalController, private customer : CustomersService,private login : LoginService) {

    }

    ngOnInit() {
        this.getTicketsByCustomer();
    }
    dismissModal() {
        this.modalCrtl.dismiss({
            'dismissed': true
        });
    }


    getTicketsByCustomer(){
        this.customer.getCustomer(this.id)
        .subscribe(res => {
            this.customerData = res;
            if (this.customerData.tickets.length > 0) {
                this.customerData?.tickets.map(x => {
                    if (x.operator_id) {
                        this.login.getUserDataStatus(x.operator_id)
                    .subscribe(res => {
                        this.operator = res;
                        x.operator_name = this.operator.username;
                    })
                    }
                })
                this.ticketsByCustomer = this.customerData.tickets;
            } else {
                this.existedTicket = false;
            }
        })
    }
}
