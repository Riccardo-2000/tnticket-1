import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { CheckTokenService } from 'src/app/services/check-token.service';
import { CustomersService } from 'src/app/services/customers.service';
import { TechsService } from 'src/app/services/techs.service';
import { TicketsService } from './../../services/tickets.service';
import { ChartsService } from './../../services/charts.service';
import { StoreService } from './../../store/store.service';
import { Observable } from 'rxjs';
import { Ticket } from './../../interfaces/ticket';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ticketDataset:any;

  startDate:any;
  lateTicket:any;
  priorityHighTickets$:Observable<Ticket[]>;
  priorityTicketDelay$:Observable<Ticket[]>
  customerData:any;
  techsData:any;

  ticketInOneMonth:Number;

  //=> Charts
  fiveAgo:any;
  tenAgo:any;
  fifteenAgo:any;
  twentyAgo:any;
  twentyFiveAgo:any;
  oneMonthAgo:any;


  constructor(private tickets : TicketsService, private customers : CustomersService,private Techs : TechsService,private token : CheckTokenService,private charts : ChartsService,private store : StoreService)
  {
    // this.priorityHighTickets = [];
    this.lateTicket= [];
    this.ticketInOneMonth = 0;
    this.fiveAgo=[];
    this.tenAgo = [];
    this.fifteenAgo = [];
    this.twentyAgo = [];
    this.twentyFiveAgo = [];
    this.oneMonthAgo = [];
  }

  ngOnInit(): void {
    this.store.init();
    this.priorityHighTickets$ = this.store.getTicketsHighPriority();
    this.priorityTicketDelay$ = this.store.getTicketsHighDelay();

    this.datasetTicket();
    this.chartTickets();
  }

  datasetTicket(){
    let today = new Date(Date.now()) ;
    console.log("today "+today)
    let fiveAgo = Date.now() - 5*24*60*60*1000;
    let tenAgo = Date.now() - 10*24*60*60*1000;
    let fifteenAgo = Date.now() - 15*24*60*60*1000;
    let twentyAgo = Date.now() - 20*24*60*60*1000;
    let twentyFiveAgo = Date.now() - 25*24*60*60*1000;
    let oneMonthAgo = Date.now() - 30*24*60*60*1000;
    this.tickets.getAllTickets()
    .subscribe(res => {
      this.ticketDataset = res;
      this.ticketDataset.map(x => {
        
        x.ticket_date = Date.parse(x.ticket_date);
        x.timestamp = x.ticket_date;
        if (parseInt(x.timestamp) >= oneMonthAgo && parseInt(x.timestamp) <= twentyFiveAgo ) {
          this.twentyFiveAgo.push(x.timestamp);
        }
        if (parseInt(x.timestamp) >= oneMonthAgo && parseInt(x.timestamp) <= twentyAgo && parseInt(x.timestamp) > twentyFiveAgo ) {
          this.twentyAgo.push(x.timestamp);
        }
        if (parseInt(x.timestamp) >= oneMonthAgo && parseInt(x.timestamp) <= fifteenAgo && parseInt(x.timestamp) > twentyAgo ) {
          this.fifteenAgo.push(x.timestamp);
        }
        if (parseInt(x.timestamp) >= oneMonthAgo && parseInt(x.timestamp) <= tenAgo && parseInt(x.timestamp) > fifteenAgo ) {
          this.tenAgo.push(x.timestamp);
        }
        if (parseInt(x.timestamp) >= oneMonthAgo && parseInt(x.timestamp) <= fiveAgo && parseInt(x.timestamp) > tenAgo ) {
          this.fiveAgo.push(x.timestamp);
        }
        if (parseInt(x.timestamp) >= oneMonthAgo && parseInt(x.timestamp) <= fiveAgo && parseInt(x.timestamp) > fiveAgo ) {
          this.oneMonthAgo.push(x.timestamp);
        }
        this.chartCustomers(this.oneMonthAgo.length,this.fiveAgo.length,this.tenAgo.length,this.fifteenAgo.length,this.twentyAgo.length,this.twentyFiveAgo.length)
      })
    })
  }

  // => Charts
  chartCustomers(month,five,ten,fifteen,twenty,twentyFive){
    // console.log(this.fifteenAgo.length);
    let ctx = document.getElementById('tickets');
    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',


      // The data for our dataset
      data: {
        labels: ['0', '5 Days', '10 Days', '15 Days', '20 Days', '25 Days'],
        datasets: [{
          label: 'Tickets In A Month',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [
            month,
            five,
            ten,
            fifteen,
            twenty,
            twentyFive,
          ]
        }]
      },

      // Configuration options go here
      options: {}
    });
  }
  chartTickets(){
    let ctx = document.getElementById('customers');
    let chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'radar',

      // The data for our dataset
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Customer In A Month',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45]
        }]
      },

      // Configuration options go here
      options: {}
    });
  }
}

