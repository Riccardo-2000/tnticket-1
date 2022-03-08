import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from './../interfaces/ticket';



// => Import Environment URL
import { url } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  url: String;
  constructor(private HttpClient: HttpClient) {
    this.url = url;
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.HttpClient.get<Ticket[]>(this.url + 'tickets');
  }
  getNotAssignedTickets(): Observable<Ticket[]> {
    return this.HttpClient.get<Ticket[]>(this.url + 'tickets/notworking');
  }
  getTicketBySearch(searchValue: Object): Observable<Ticket[]> {
    return this.HttpClient.get<Ticket[]>(this.url + 'tickets/search/' + searchValue);
  }
  getTicketBySearchDate(searchValue: Object): Observable<Ticket[]> {
    return this.HttpClient.get<Ticket[]>(this.url + 'tickets/search/date' + searchValue);
  }

  getticketsbytech(id: String) {
    return this.HttpClient.get(this.url + 'ticketsbytechAdmin/' + id);
  }
  
  getticketsbycust(id: String) {
    return this.HttpClient.get(this.url + 'ticketsbycust/' + id);
  }

  getSpecificTicket(id: String) {
    return this.HttpClient.get(this.url + 'ticket/' + id);
  }
  deleteSpecificTicket(id: String) {
    console.log(id)
    return this.HttpClient.delete(this.url+'tickets/'+id)
  }

  createNewTickets(newTicket: Object) {
    return this.HttpClient.post(this.url + 'tickets', newTicket);
  }
  updateTicket(id: String, dataToUpdate) {
     return this.HttpClient.post(this.url+'tickets/'+id,dataToUpdate)
  }
}
