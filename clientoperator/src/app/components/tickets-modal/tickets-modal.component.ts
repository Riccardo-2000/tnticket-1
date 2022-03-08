import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TicketsDataService } from 'src/app/services/tickets-data.service';
import { Observable,fromEvent,concat } from 'rxjs';
import { Ticket } from './../../interfaces/ticket';
import { map,debounceTime,distinctUntilChanged,switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-tickets-modal',
    templateUrl: './tickets-modal.component.html',
    styleUrls: ['./tickets-modal.component.scss'],
})
export class TicketsModalComponent implements OnInit {
    @ViewChild('searchInput') input:ElementRef;


    allTickets$:Observable<Ticket[]>;


    constructor(private router : Router, public modalCrtl : ModalController, private ticketsService : TicketsDataService, private routerModule : RouterModule) { }

    ngOnInit() {
        this.getTickets();
    }


    ngAfterViewInit(){
        const searchTicket$ =  fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
            map(event => event.target.value),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(search =>this.loadTickets(search))
        )
        const initialTickets$ = this.ticketsService.getTickets()
        .pipe(
            map(tickets => tickets.filter(tickets => tickets.operator_id == null && tickets.status != "Risolto"))
            )
        this.allTickets$ = concat(initialTickets$,searchTicket$);
    }

    loadTickets(search = ''):Observable<Ticket[]>{
        if (search != '') {
            return this.ticketsService.getTicketBySearchObs(search)
            .pipe(
                map(tickets=> tickets.filter(tickets => tickets.status != "Risolto"))
            );
        }
        return this.allTickets$ = this.ticketsService.getTickets()
        .pipe(
            map(tickets => tickets.filter(tickets => tickets.operator_id == null && tickets.status != "Risolto"))
            )
    }


    dismissModal() {
        this.modalCrtl.dismiss({
            'dismissed': true
        });
    }


    getTickets(){
        this.allTickets$ = this.ticketsService.getTickets()
        .pipe(
            map(tickets => tickets.filter(tickets => tickets.operator_id == null && tickets.status != "Risolto"))
            )
        }
    }





