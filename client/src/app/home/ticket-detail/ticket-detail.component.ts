import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from '../../shared/interfaces/Ticket';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
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
export class TicketDetailComponent implements OnInit {

  @Input() ticket : Ticket;
  minutes: any;
  addetti: Boolean = false;
  constructor() { }

  ngOnInit(): void {
    console.log( this.ticket.ticket_time );
    let diff = 0;
    if( typeof this.ticket.ticket_time[0] === "object" ){
      let time_index = 0;
      this.minutes = 0;
      while( time_index <= this.ticket.ticket_time.length - 1 ){
        var ticket_time_obj:any = this.ticket.ticket_time[time_index];
        let arr:any  = [];
        for(let key in ticket_time_obj){
          arr.push( ticket_time_obj[key] );
        }
        //this.ticket.ticket_time = [arr];
        //console.log( new Date(arr[1]) );
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
        if( arr[2] != null ){
          this.addetti = true;
          diff = diff * 2;
        }
        this.minutes = parseInt(this.minutes) + parseInt((diff / (1000 * 60)).toFixed(0));
        time_index++;
      }
      //var result = Object.keys(ticket_time_obj).map((key) => [Number(key), ticket_time_obj[key]]);
    }
  }

}
