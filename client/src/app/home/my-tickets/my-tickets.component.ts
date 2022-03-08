import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Ticket } from '../../shared/interfaces/Ticket';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss'],
  animations : [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)', transition:0.5 }),
        animate('200ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ]
})
export class MyTicketsComponent implements OnInit {

  @Input() tickets : Ticket[];
  @Output() ticket = new EventEmitter<Ticket>()

  
  constructor() { }

  //totalItems = 100 ;
  currentPage = 0;
  total_minutes = 0;
  totalItems = 0;
  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  ngOnInit(): void {

    //console.log(this.tickets);
    this.tickets.map( single_ticket => this.add_minutes( single_ticket ) );
    this.totalItems = this.tickets.length;
    //this.total_minutes = parseInt((this.total_minutes / 60).toFixed(0));
    //localStorage.setItem( "total_minutes", JSON.stringify(this.total_minutes) );

  }

  showDetail(ticket){

    return this.ticket.emit(ticket)

  }

  add_minutes( single_ticket ){
    let diff = 0;
    single_ticket.minutes = 0;
    if( typeof single_ticket.ticket_time[0] === "object" ){
      let time_index = 0;
      while( time_index <= single_ticket.ticket_time.length - 1 ){
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
          diff = +new Date( date_end_ymdtime )- +new Date( date_start_ymdtime );
        }
        else {
          diff = +new Date(arr[1])- +new Date(arr[0]);
        }
        diff = parseInt((diff / (1000 * 60)).toFixed(0));
        if( diff > 0 && diff < 15 ){ 
          diff = 15;
        }
        if( arr[2] != null ){
          diff = diff * 2;
        }
        single_ticket.minutes = parseInt(single_ticket.minutes) + diff;
        time_index++;
      }
      //this.total_minutes = this.total_minutes + parseInt(single_ticket.minutes);
    }
    else {
      if( single_ticket.operator_id?._id == "5fc8d9d35892ccde65f78069" ){
        let ticket_hours:any = parseFloat(single_ticket.note.split("|")[1].replace(",","."))*60;
        single_ticket.minutes = parseInt(ticket_hours);
      }
    }
  }

}
