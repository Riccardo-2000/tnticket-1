import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Observable,fromEvent, concat } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { LoginService } from '../services/login.service';
import { TicketsDataService } from '../services/tickets-data.service';

import { Ticket } from './../interfaces/ticket';


import{concatMap, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators'
import { AlertController } from '@ionic/angular';
@Component({
    selector: 'app-search-ticket',
    templateUrl: './search-ticket.page.html',
    styleUrls: ['./search-ticket.page.scss'],

})
export class SearchTicketPage implements OnInit {
    @ViewChild('searchInput') input:ElementRef;
    allTickets$:Observable<Ticket[]>;

    // => ShowSearchByDate
    showSearchByDate:Boolean=false;
    loaded:boolean=false


    // => Search Date Filter
    dateOne:any;
    dateTwo:any;
    constructor(private tickets : TicketsDataService,private login : LoginService,public loading: LoadingService,public alertController: AlertController){}
    ngOnInit() {
        this.allTickets$ = this.loadTickets();
        this.allTickets$.subscribe( res =>{})
    }
    ngAfterViewInit(){
        const searchTicket$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
            map(event => event.target.value),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(search => this.loadTickets(search))
        )
        const initialTickets$ = this.initialTickets();
        this.allTickets$ = concat(initialTickets$,searchTicket$);
    }
    loadTickets(search = ''):Observable<Ticket[]>{
        this.loaded=true
        if (search != '') {
            return this.allTickets$.pipe(
                tap(res=>{if(res){this.loaded=false}}),
                map(tickets => tickets.filter(tickets => (tickets.ticket_number==Number(search) || tickets.customer_id?.company_name.toLowerCase().includes(search.toLowerCase()) || tickets.title.toLowerCase().includes(search.toLowerCase()))))
            );
        }
        return this.tickets.getTickets().pipe(tap(res=>{if(res){this.loaded=false}}));;
    }
    initialTickets():Observable<Ticket[]>{
        return this.tickets.getTickets();
    }

    searchByDate(){
        if (this.dateOne == undefined && this.dateTwo == undefined || this.dateOne == undefined || this.dateTwo == undefined ) {
            this.presentAlert()
        } else {
            const dateOne = new Date(this.dateOne).toISOString()
            const dateTwo = new Date(this.dateTwo).toISOString()
            const term = {
                dateOne : dateOne,
                dateTwo : dateTwo,
            }

            this.allTickets$ = this.tickets.getTicketsByDate(term);
        }
    }

    async presentAlert() {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Attenzione',
          message: 'Tutti i campi data devono essere compilati',
          buttons: ['OK']
        });
        await alert.present();
      }
}
