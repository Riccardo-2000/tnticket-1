import { Injectable } from '@angular/core';
import {HttpClientModule,HttpClient} from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Ticket } from '../interfaces/ticket';




// => Import Environment URL
import { url } from '../../environments/environment'
import { filter, map, switchMap } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class StoreService {
  today : any = new Date();
  startDate : any = new Date(this.today.getTime() - 4*24*60*60*1000);

  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ : Observable<Ticket[]> = this.ticketsSubject.asObservable();


  constructor(private http :  HttpClient){}




  init(){
    return this.http.get<Ticket[]>(url+'tickets')
    .subscribe(tickets => this.ticketsSubject.next(tickets))
  }

  getTicketsHighPriority(){
    return this.tickets$
    .pipe(
      map(tickets => tickets.filter(ticket => ticket.priority === 'high' && ticket.status != 'Risolto' ))
    )
  }
  getTicketsHighDelay(){
    return this.tickets$
    .pipe(
      map(tickets => tickets.filter(ticket => parseInt(ticket.ticket_date) <= parseInt(this.startDate.getTime()) && ticket.status !== 'Risolto'))
    )
  }
  updateTicket(id:String, dataToUpdate:Ticket):Observable<Ticket>{
    const tickets = this.ticketsSubject.getValue();
    const ticketIndex = tickets.findIndex(ticket => ticket._id == id)
    const newTickets = tickets.slice(0);
    console.log(newTickets[ticketIndex]);
    newTickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...dataToUpdate
    }

    this.ticketsSubject.next(newTickets);
    return this.http.post<Ticket>(url+'tickets/'+id,dataToUpdate)
  }
}
