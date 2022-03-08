import { HttpClient, HttpErrorResponse,HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket } from './../interfaces/ticket';

import { url } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class TicketsDataService {
    url:String;
    constructor(private http : HttpClient) {
        this.url = url;
    }

    //=> Observable Get All Tickets
    getTickets():Observable<Ticket[]>{
        return this.http.get<Ticket[]>(this.url+'tickets');
    }
    //=> Observable Get TicketsBySearch
    getTicketBySearchObs(term):Observable<Ticket[]>{
        return this.http.get<Ticket[]>(this.url +'tickets/search/'+term);
    }
    //=> Observable Get Just Tickets Assigned
    getTicketsWorking():Observable<Ticket[]>{
        return this.http.get<Ticket[]>(this.url+'tickets/working');
    }
    //=> Observable Get Just Tickets Not Assigned
    getTicketsNotWorking():Observable<Ticket[]>{
        return this.http.get<Ticket[]>(this.url+'tickets/notworking');
    }
    //=> Observable Get Just Tickets Not Assigned
    getTicketsByTech(id:String):Observable<Ticket[]>{
        return this.http.get<Ticket[]>(this.url+'ticketsbytech/'+id);
    }
    //=> Observable Get Tickets By Date
    getTicketsByDate(term):Observable<Ticket[]>{
        return this.http.post<Ticket[]>(this.url+'ticketsbydate', term);
    }

    sendTicketsReq(){
        return this.http.get(this.url+'tickets');
    }

    sendMyTicketsReq(id:String){
        return this.http.get(this.url+'tickets/'+id);
    }

    getTicket(id:String){
        return this.http.get(this.url +'ticket/'+ id);
    }

    sendNewTicketReq(newTicket){
        return this.http.post(this.url+'tickets', newTicket);
    }

    ticketUpdate(id,dataTicketUpdated){
        return this.http.post(this.url+'tickets/'+id,dataTicketUpdated);
    }
    ticketImageUpdate(id,payload){
        return this.http.post<Ticket>(this.url+'ticketupdateimage/'+id,payload);
    }

    ticketDelete(id:String){
        return this.http.delete(this.url+'tickets/'+id);
    }

    getTicketBySearch(term){
        return this.http.get(this.url +'tickets/search/'+term);
    }

    ticketReverse(id:String){
        return this.http.get(this.url+"user/latest/"+id);
    }

    sendDelega(id:String,payload){
        return this.http.post(this.url+'ticket/delega/'+id,payload);
    }

    sendReminder(id:String,payload){
        return this.http.post(this.url+'tickets/reminder/'+id,payload);
    }

    loadSign(ticketId : string, payload : Partial<Ticket>) :Observable<Ticket> {

        return this.http.post<Ticket>(this.url+'ticket/loadsignature/' + ticketId,payload );

    }



}
