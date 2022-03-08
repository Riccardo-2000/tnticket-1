import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from './../../interfaces/ticket';
import jsPDF from 'jspdf';
import { ModalController } from '@ionic/angular';
import { ModalCloneTicketComponent } from '../modal-clone-ticket/modal-clone-ticket.component';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit {
  @Input('') tickets$: Observable<Ticket[]> 
  today = new Date(Date.now())
  interval;

  allTickets:any

  constructor(public modalController: ModalController) {

  }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    
    changes.tickets$.currentValue.forEach(ticket=>{
      var total=0
      var crono =''
      var creationTicket: Date=  new Date(ticket.createdAt)
      total=this.today.getTime()-creationTicket.getTime()
      crono = this.getcrono(total)
      ticket.ticketOpening = crono
      
    })
    // changes.ticket$.currentValue.forEach(ticket=>{
    //   console.log(ticket)
    // })
  }

  getcrono(ms) {
    const day = Math.floor(ms / (1000 * 3600 * 24));
    const hours = Math.floor((ms - day * (1000 * 3600 * 24)) / (1000*3600));
    const minutes = Math.floor((ms - day * (1000 * 3600 * 24) - hours * (1000*3600)) / (1000*60));

    return day + ' g ' + (hours < 10 ? '0' : '') + hours + ' h ' + (minutes < 10 ? '0' : '') + minutes+' min';
}


  async cloneTicket(id){
    console.log(id)
    const modal = await this.modalController.create({
      component: ModalCloneTicketComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'id': id,
    }
    });
    return await modal.present();
  }




}
