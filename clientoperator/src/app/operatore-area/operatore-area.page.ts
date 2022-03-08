import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, fromEvent, concat } from 'rxjs';
import { TicketsModalComponent } from '../components/tickets-modal/tickets-modal.component';
import { LoadingService } from '../services/loading.service';
import { StorageService } from '../services/storage.service';
import { TicketsDataService } from '../services/tickets-data.service';
import { LoginService } from './../services/login.service';
import { Ticket } from './../interfaces/ticket';
import { map, tap, shareReplay, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
    selector: 'app-operatore-area',
    templateUrl: './operatore-area.page.html',
    styleUrls: ['./operatore-area.page.scss'],
})
export class OperatoreAreaPage implements OnInit {
    @ViewChild('searchInput') input: ElementRef;
    @ViewChild('searchNotAssignedInput') inputNotAssigned: ElementRef;

    // => Slider Options
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 1.3
    };
    // => Controller TicketEsistenti
    existedTicket: Boolean = true;
    //=> ParamsFromCreatCustomer
    params: any;
    ///=> Observables
    ticketNotAssigned$: Observable<Ticket[]>;
    ticketAssigned$: Observable<Ticket[]>;
    tickets$: Observable<Ticket[]>;
    searchLoaded:boolean=false

    constructor
        (private router: Router,
            public modalCrtl: ModalController,
            private ticketsService: TicketsDataService,
            private route: ActivatedRoute,
            private login: LoginService,
            public loading: LoadingService,
            private storage: StorageService
        ) { }

    ngOnInit() {
        this.ticketAssigned$ = this.initialTicketAssigned();
        this.ticketNotAssigned$ = this.initialTicketNotAssigned();
        console.log(this.route.snapshot.paramMap);


    }
    ngAfterViewInit() {
        this.refresh();


        this.getIdTicketDeleted();
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

        const initialNotAssigned$ = this.initialTicketNotAssigned();
        const initialTickets$ = this.initialTicketAssigned();
        this.ticketNotAssigned$ = concat(initialNotAssigned$, searchNotAssignedTicket$);
        this.ticketAssigned$ = concat(initialTickets$, searchTicket$);
    }
    loadNotassignedTickets(search = ''): Observable<Ticket[]> {
        this.searchLoaded=true
        if (search != '') {
            return this.ticketNotAssigned$
                .pipe(
                    tap(res=>{if(res){this.searchLoaded=false}}),
                    map(tickets => tickets.filter(tickets => (tickets.ticket_number==Number(search) || tickets.customer_id.company_name.toLowerCase().includes(search.toLowerCase()))))
                )
        }
        return this.ticketNotAssigned$.pipe(tap(res=>{if(res){this.searchLoaded=false}}));
    }
    loadTickets(search = ''): Observable<Ticket[]> {
        this.searchLoaded=true
        if (search != '') {
            return this.ticketAssigned$
                .pipe(
                    tap(res=>{if(res){this.searchLoaded=false}}),
                    map(tickets => tickets.filter(tickets => (tickets.ticket_number == Number(search) || tickets.customer_id.company_name.toLowerCase().includes(search.toLowerCase()))))
                )
        }
        return this.ticketAssigned$.pipe(tap(res=>{if(res){this.searchLoaded=false}}));;
    }
    initialTicketAssigned() {
        return this.ticketsService.getTicketsWorking().pipe(tap(tickets => {
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
    initialTicketNotAssigned() {
        return this.ticketsService.getTicketsNotWorking().pipe(tap(tickets => {
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

    goToCreateTicket() {
        this.router.navigate(['/create-ticket']);
    }
    async presentModal() {
        const modal = await this.modalCrtl.create({
            component: TicketsModalComponent,
            cssClass: 'my-custom-modal-css'
        });
        return await modal.present();
    }
    goToTicket(id) {
        this.router.navigate(["/ticket/" + id]);
    }
    doRefresh(event) {
        this.ngOnInit();
        setTimeout(() => {
            event.target.complete();
        }, 3000);
    }
    reverseTicket() {
        this.ticketAssigned$ = this.ticketAssigned$
            .pipe(
                map(tickets => tickets.reverse())
            );
    }
    reverseTicketAvailable() {
        this.ticketNotAssigned$ = this.ticketNotAssigned$
            .pipe(
                map(tickets => tickets.reverse())
            );
    }
    async getparamsFromNewCustomer() {
        this.params = this.route.params;
        if (this.params != null) {
            this.ngOnInit()
        }
    }

    refresh() {
        if (this.route.snapshot.paramMap) {
            // this.ngOnInit();
            this.ticketAssigned$ = this.initialTicketAssigned();
            this.ticketNotAssigned$ = this.initialTicketNotAssigned();
        }
    }
    getIdTicketDeleted() {
        if (this.route.snapshot.params.id) {
            this.ngOnInit();
            this.ticketAssigned$ = this.initialTicketAssigned();
            this.ticketNotAssigned$ = this.initialTicketNotAssigned();
        }
    }
}
