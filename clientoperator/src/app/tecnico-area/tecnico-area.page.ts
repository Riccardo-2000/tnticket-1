import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { LoginService } from '../services/login.service';
import { StorageService } from '../services/storage.service';
import { TicketsDataService } from './../services/tickets-data.service';
import { Observable, fromEvent, concat, interval, Subscription } from 'rxjs';
import { map, tap, shareReplay, debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Ticket } from './../interfaces/ticket';
import { clear } from 'console';

@Component({
    selector: 'app-tecnico-area',
    templateUrl: './tecnico-area.page.html',
    styleUrls: ['./tecnico-area.page.scss'],
})
export class TecnicoAreaPage implements OnInit {
    @ViewChild('searchInput') input: ElementRef;
    @ViewChild('searchNotAssignedInput') inputNotAssigned: ElementRef;
    myId: any;
    // => Slider Options
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 1.3
    };

    //ShowNoTicket
    showNoTicket: Boolean = false;
    //Controller existed Ticket
    existedTicket: Boolean = true;
    searchword

    private updateSubscription: Subscription;
    searchLoaded: boolean = false
    //=>Observable
    ticketNotAssigned$: Observable<Ticket[]>;
    myTickets$: Observable<Ticket[]>;
    ticketsObject: any;
    constructor(private router: Router, private storage: StorageService, private ticketService: TicketsDataService, private login: LoginService, public loading: LoadingService) {
        this.updateSubscription = interval(300000)
            .subscribe((val) => {
                console.log('called');
                this.ngOnInit();
                this.ngAfterViewInit()
            });
    }

    async ngOnInit() {
        await this.storage.getItem('userData').then(res => {
            this.myId = JSON.parse(res);

        })

        const ticket$: Observable<Ticket[]> = this.ticketService.getTickets()
            .pipe(
                tap(() => console.log("Http Request Executed")),
                map(res => Object.values(res)),
                shareReplay()
            );
        this.ticketNotAssigned$ = this.ticketNotAssigned();
        this.myTickets$ = this.initialTicket(this.myId._id)
    }

    async ngAfterViewInit() {
        await this.storage.getItem('userData').then(res => {
            this.myId = JSON.parse(res);

        })
        const searchTicket$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                debounceTime(200),
                distinctUntilChanged(),
                switchMap(search => this.loadTickets(search))
            )

        const searchNotAssignedTicket$ = fromEvent<any>(this.inputNotAssigned.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                debounceTime(200),
                distinctUntilChanged(),
                switchMap(search => this.loadNotassignedTickets(search))
            )

        const initialNotAssigned$ = this.ticketNotAssigned();
        const initialTickets$ = this.initialTicket(this.myId._id);
        this.ticketNotAssigned$ = concat(initialNotAssigned$, searchNotAssignedTicket$);
        this.myTickets$ = concat(initialTickets$, searchTicket$);
    }
    loadNotassignedTickets(search = ''): Observable<Ticket[]> {
        this.searchLoaded = true
        if (search != '') {
            return this.ticketNotAssigned$
                .pipe(
                    tap(res => { if (res) { this.searchLoaded = false } }),
                    map(tickets => tickets.filter(tickets => (tickets.ticket_number == Number(search) || tickets.customer_id.company_name.toLowerCase().includes(search.toLowerCase()))))
                )
        }
        return this.ticketNotAssigned$.pipe(tap(res => { if (res) { this.searchLoaded = false } }));
    }
    loadTickets(search = ''): Observable<Ticket[]> {
        this.searchLoaded = true
        if (search != '') {
            return this.myTickets$
                .pipe(
                    tap(res => { if (res) { this.searchLoaded = false } }),
                    map(tickets => tickets.filter(tickets => (tickets.ticket_number == Number(search) || tickets.customer_id.company_name.toLowerCase().includes(search.toLowerCase()))))
                )
        }
        return this.myTickets$.pipe(tap(res => { if (res) { this.searchLoaded = false } }));
    }
    initialTicket(id): Observable<Ticket[]> {
        return this.ticketService.getTicketsByTech(id).pipe(tap(tickets => {
            tickets.forEach(ticket => {

                if (ticket.priority == "low") {
                    ticket.priorityOrder = 1
                } else if (ticket.priority == "medium") {
                    ticket.priorityOrder = 2


                } else {

                    ticket.priorityOrder = 3
                }

            });
        }), map(tickets => tickets.sort((a, b) => (((b.priorityOrder - a.priorityOrder) || b.reminder.length - a.reminder.length) || (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())))))
    }
    ticketNotAssigned(): Observable<Ticket[]> {
        return this.ticketService.getTicketsNotWorking().pipe(tap(tickets => {
            tickets.forEach(ticket => {

                if (ticket.priority == "low") {
                    ticket.priorityOrder = 1
                } else if (ticket.priority == "medium") {
                    ticket.priorityOrder = 2


                } else {

                    ticket.priorityOrder = 3
                }

            });
        }), map(tickets => tickets.sort((a, b) => (((b.priorityOrder - a.priorityOrder) || b.reminder.length - a.reminder.length) || (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())))))


    }
    doRefresh() {
        this.searchword=""
        this.ngOnInit()
        this.ngAfterViewInit()
        // setTimeout(() => {
        //     event.target.complete();
        // }, 2000);
    }
    // doRefreshReverse() {
    //     this.ngOnInit()
    //     setTimeout(() => {
    //     }, 2000);
    // }
    reverseTicket() {
        this.myTickets$ = this.myTickets$
            .pipe(
                map(tickets => tickets.reverse())
            )
    }
    reverseTicketAvailable() {
        this.ticketNotAssigned$ = this.ticketNotAssigned$
            .pipe(
                map(tickets => tickets.reverse())
            )
    }
    // refresh(e){
    //     this.doRefresh(e);
    // }
}
