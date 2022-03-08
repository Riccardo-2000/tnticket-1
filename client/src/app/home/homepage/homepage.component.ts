import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthStore } from 'src/app/store/auth.store';
import { Observable, of } from 'rxjs';
import { Ticket } from '../../shared/interfaces/Ticket';
import { filter, map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';


const AuthLocalStorage = 'TNC_User';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {


  tickets$ : Observable<Ticket[]>;
  contract_hours$ : Observable<Number>;
  contract_start$ : Observable<string>;
  //ticketsOn$ : Observable<Number>;
  ticketsOn = 0;
  username$ : Observable<string>;
  user_id$ : Observable<string>;


  // Navigation Booleans
  ticketsTable : Boolean = true;
  dataCustomer : Boolean = false;
  infoCustoomer : Boolean = false;

  // Ticket Detail
  ticketToShow : Ticket;
  total_minutes = 0;
  hours_alert: Boolean = false;
  display_old: Boolean = true;
  display_current: Boolean = false;

  constructor(private store : AuthStore) {
  }

  ngOnInit(): void {

    this.tickets$ = this.store.reload();
    this.tickets$.subscribe( res => { 
      res.map( single_ticket => this.add_minutes( single_ticket ) ); 
      this.total_minutes = parseInt((this.total_minutes / 60).toFixed(0));
      const contract_hours = JSON.parse(localStorage.getItem(AuthLocalStorage)).contract_hours;
      if( contract_hours && this.total_minutes > contract_hours ){
        //console.log( contract_hours );
        document.getElementById("current-status").style.color = "red";
        this.hours_alert = true;
      } 
    } );
    this.contract_hours$  = this.store.user$.pipe(map( user =>  user?.contract_hours ) );
    this.contract_start$ = this.store.user$.pipe(map( user =>  user?.contract_start));
    //this.ticketsOn$ = this.store.user$.pipe(map( user => user?.tickets.filter( x => x.status != 'Risolto').length));
    this.username$ = this.store.user$.pipe(map( user => user?.username));
    this.user_id$ = this.store.user$.pipe(map( user => user?._id));
    //this.total_minutes = JSON.parse(localStorage.getItem("total_minutes"));
    /*if( this.total_minutes > 50 ){
      document.getElementById("current-status").style.color = "red";
    }*/
  }

  ngAfterViewInit() {
    
  }

  navigationComponent(str){

    if (str === 'tickets') {
        this.ticketsTable = true;
        this.dataCustomer = false;
        this.infoCustoomer = false;
        this.ticketToShow = null;

    } else if(str === 'dati'){

      this.ticketsTable = false;
      this.dataCustomer = true;
      this.infoCustoomer = false;
      this.ticketToShow = null;

    } else if(str = 'ticketDetail') {

      this.ticketsTable = false;
      this.dataCustomer = false;
      this.infoCustoomer = false;

    } else {

      this.ticketsTable = false;
      this.dataCustomer = false;
      this.infoCustoomer = true;
      this.ticketToShow = null;

    }

  }

  filterTickets(value){

    if (value === "All") {

      return this.tickets$ = this.store.reload();

    } else if (value === "Risolto") {

      return this.tickets$ = this.tickets$.pipe(

        map( ticket => ticket.filter( ticket => ticket.status == "Risolto")),
        tap( (value) => console.log(value))

      );

    } else {

      return this.tickets$ = this.tickets$.pipe(

        map( ticket => ticket.filter( ticket => ticket.status != "Risolto")),
        tap( (value) => console.log(value))


      );

    }


  }

  changeViewCompponent(ticket){

    this.ticketToShow = ticket;

    return this.navigationComponent('ticketDetail')

  }


  logout(){

    return this.store.logout();

  }

  add_minutes( single_ticket ){
    let diff = 0;
    single_ticket.minutes = 0;
    if( typeof single_ticket.ticket_time[0] === "object" ){
      let time_index = 0;
      while( time_index <= single_ticket.ticket_time.length - 1 ){
        //console.log( single_ticket.ticket_number, single_ticket.ticket_time[0] );
        var ticket_time_obj:any = single_ticket.ticket_time[time_index];
        let arr:any  = [];
        for(let key in ticket_time_obj){
          arr.push( ticket_time_obj[key] );
        }
        if(arr[0].indexOf("T") === -1){
          let date_end = arr[1].split(" ");
          //console.log( date_end );
          let date_end_dmy = date_end[0].split("/");
          let date_end_ymd = date_end_dmy[2]+"-"+date_end_dmy[1]+"-"+date_end_dmy[0];
          let date_end_ymdtime = date_end_ymd+"T"+date_end[1];        
          let date_start = arr[0].split(" ");
          //console.log( date_end );
          let date_start_dmy = date_start[0].split("/");
          let date_start_ymd = date_start_dmy[2]+"-"+date_start_dmy[1]+"-"+date_start_dmy[0];
          let date_start_ymdtime = date_start_ymd+"T"+date_start[1];
          //console.log( date_end_ymdtime, date_start_ymdtime );
          diff = ( +new Date( date_end_ymdtime )- +new Date( date_start_ymdtime ) );
        }
        else {
          diff = ( +new Date(arr[1])- +new Date(arr[0]) );
        }
        diff = parseInt((diff / (1000 * 60)).toFixed(0));
        if( diff > 0 && diff < 15 ){ 
          diff = 15;
        }
        if( arr[2] != null ){
          console.log( single_ticket.ticket_number );
          diff = diff * 2;
        }
        single_ticket.minutes = parseInt(single_ticket.minutes) + diff;
        time_index++;
      }
      this.total_minutes = this.total_minutes + parseInt(single_ticket.minutes);
    }
    else {
      if( single_ticket.operator_id?._id == "5fc8d9d35892ccde65f78069" ){
        let ticket_hours:any = parseFloat(single_ticket.note.split("|")[1].replace(",","."))*60;
        this.total_minutes = this.total_minutes + parseInt(ticket_hours);
      }
    }
    if( single_ticket.status != "Risolto" ){
      this.ticketsOn++;
    }
  }

  old_tickets(){
    this.display_old = false;
    this.display_current = true;
    this.tickets$ = this.store.reload( true );
  }
  current_tickets(){
    this.display_old = true;
    this.display_current = false;
    this.tickets$ = this.store.reload( false );
  }

}
