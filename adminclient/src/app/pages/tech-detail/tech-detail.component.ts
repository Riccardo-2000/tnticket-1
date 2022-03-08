import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, interval } from 'rxjs';
import { Ticket } from 'src/app/interfaces/ticket';
import { User } from 'src/app/interfaces/user';
import { TechsService } from 'src/app/services/techs.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-tech-detail',
  templateUrl: './tech-detail.component.html',
  styleUrls: ['./tech-detail.component.scss']
})
export class TechDetailComponent implements OnInit {

  private updateSubscription: Subscription;

  loaded: boolean = false
  rangeParamsUrl: boolean = false
  refresh: boolean = true

  rangeParams: Object
  dataRangeParams: FormGroup

  allTech: User[] = []

  techToEditData: any;
  techRangeData: any;
  timeWorked: any = 0;

  formDateRange: FormGroup;

  newTechData: any = {
    username: String,
    password: String,
    email: String,
    status_holiday: Boolean,
    user_type: Number,
  }
  rangeTechData: any = {
    username: String,
    password: String,
    email: String,
    status_holiday: Boolean,
    user_type: Number,
  }

  techId: any;

  techTickets: any
  rangetechTickets: any
  techRangeDataShowed: Array<Ticket> = []

  statusflag: boolean = true;

  changestatus() {
    this.statusflag = !this.statusflag;
    console.log(this.statusflag)
  }
  stopRefresh() {
    this.refresh = !this.refresh
    // this.refreshPage()
  }


  constructor(public modalService: NgbModal, private users: UsersService, private route: ActivatedRoute, private router: Router, private ticketService: TicketsService, private techs: TechsService, private fb: FormBuilder) {


    this.formDateRange = fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    })

    route.params.subscribe(
      (params) => {
        var id = params['id'];
        this.techId = params['id'];
        this.dataRangeParams = fb.group({
          start: params['start'],
          end: params['end']
        });

        if (params['start'] && params['end']) {//se c'è un parametro di range data

          console.log("parametri  presenti")
          var paramRange = { start: params['start'], end: params['end'] }
          this.rangeParamsUrl = true

           this.users.getSpecificUser(id).subscribe(res => {
             this.techToEditData = res;
             // console.log("res " + res);
             this.newTechData.id = this.techToEditData._id;
             this.newTechData.username = this.techToEditData.username;
           })

          console.log("parametri presenti")
          this.formDateRange = fb.group({
            start: [params['start'], Validators.required],
            end: [params['end'], Validators.required]
          })


          this.getRangeDate(paramRange)

        } else {

          console.log("parametri non presenti")
          this.loaded = true
          this.users.getSpecificUser(id)
            .subscribe(res => {
              this.techToEditData = res;
              // console.log("res " + res);
              this.newTechData.id = this.techToEditData._id;
              this.newTechData.username = this.techToEditData.username;
              this.newTechData.password = this.techToEditData.password;
              this.newTechData.email = this.techToEditData.email;
              this.newTechData.status_holiday = this.techToEditData.status_holiday;
              this.newTechData.user_type = this.techToEditData.user_type;
              this.getAllTechTickets()

            });
        }
        
        
      })
      this.allTech = []
      this.techs.getAlltechs().subscribe(tecnici => {

        tecnici.forEach(tecnico => {


          if (tecnico.username != this.newTechData.username) {

            this.allTech.push(tecnico)
          }
        });
      })
  }

  getAllTechTickets() {
    this.techTickets = []
    this.ticketService.getticketsbytech(this.newTechData.id).subscribe(result => {

      //  console.log("result "+result[0].customer_id)
      this.techTickets = result;
      // console.log(this.techTickets.length)
      // console.log(this.techTickets.length)
      for (var i = 0; i < this.techTickets.length; i++) {
        var somma
        var risultato = 0
        if (this.techTickets[i].external) {
          this.techTickets[i].external = "On site"
        } else {
          this.techTickets[i].external = "Remoto"

        }
        for (var cont = 0; cont < this.techTickets[i].ticket_time.length; cont++) {
          // console.log("somma ")
          var date1 = new Date(this.techTickets[i].ticket_time[cont][1]).getTime()
          var date2 = new Date(this.techTickets[i].ticket_time[cont][0]).getTime()

          // console.log(date1)
          // console.log(date2)
          somma = (date1 - date2) / (3600 * 1000)
          // var somma= Math.floor((this.techTickets[i].ticket_time[cont][1]) - (this.techTickets[i].ticket_time[cont][0])) ;
          //  console.log((date1 - date2)/(60*1000))
          risultato = risultato + somma

        }
        // console.log(risultato)
        this.techTickets[i].work_time = parseFloat(risultato.toFixed(2))
      }
      this.loaded = false
    })
  }

  getRangeDate(dateRange: any) {
    var rangeStart = new Date(dateRange.start).getTime()
    var rangeEnd = new Date(dateRange.end).getTime()
    console.log("datarange")
    this.techTickets = []




    if ((this.formDateRange.valid && rangeEnd > rangeStart) || this.rangeParamsUrl) {
      this.timeWorked = 0
      // console.log(dateRange.start)
      // console.log(dateRange.end)
      this.loaded = true
      this.users.getSpecificUser(this.techId)
        .subscribe(res => {
          this.techRangeData = res;
          this.techRangeDataShowed = [];
          // console.log("res " + res);
          this.rangeTechData.id = this.techRangeData._id;
          this.ticketService.getticketsbytech(this.rangeTechData.id).subscribe(result => {
            this.rangetechTickets = result;
            // console.log("result "+result[0].ticket_time[0][0])
            // console.log(this.rangetechTickets.length)
            // console.log(this.techTickets.length)
            this.rangetechTickets.forEach(ticket => {


              var somma
              var hoursWorked = 0
              var totHoursWorked = 0
              var risultato = 0
              var notcount = 0
              var selected = false
              var startrange = new Date(dateRange.start)
              var endrange = new Date(dateRange.end)

              if (ticket.external) {
                ticket.external = "On site"
              } else {
                ticket.external = "Remoto"

              }
              if (ticket.ticket_time.length > 0) {//se sono presenti date di lavorazione
                ticket.ticket_time.forEach(time => {

                  // console.log("somma ")
                  var endjob = new Date(time[1]).getTime()
                  var startjob = new Date(time[0]).getTime()


                  if (startjob >= startrange.getTime() && startjob <= endrange.getTime()) {
                    

                    hoursWorked = (endjob - startjob) / (3600 * 1000)
                    totHoursWorked += hoursWorked
                    somma = (endjob - startjob) / (3600 * 1000)
                    risultato = risultato + somma
                    // console.log(risultato)
                    if (isNaN(risultato)) {
                      risultato = 0
                    }
                    selected = true
                    ticket.work_time = parseFloat(risultato.toFixed(2))
                  }
                  if (ticket.status!="risolto") {//se sono presenti degli orari ma il ticket è fuori range
                    
                    hoursWorked = (endjob - startjob) / (3600 * 1000)
                    somma = (endjob - startjob) / (3600 * 1000)
                    notcount = notcount + somma
                    // console.log(risultato)
                    if (isNaN(notcount)) {
                      notcount = 0
                    }
                    

                      ticket.work_time = parseFloat(notcount.toFixed(2))
                    
                  }


                });
              } else {//se NON sono presenti date di lavorazione
                if ((new Date(ticket.createdAt).getTime()) >= startrange.getTime() && (new Date(ticket.createdAt).getTime()) <= endrange.getTime()) {
                  
                    ticket.work_time=0
                  
                  selected = true
                }

              }
              
              if (selected||ticket.status!="Risolto") {
                // ticket.work_time = 0

                this.techRangeDataShowed.push(ticket)
              }
              // console.log(risultato)
              this.timeWorked = this.timeWorked + parseFloat(risultato.toFixed(2))
              // console.log(this.techRangeDataShowed)
              // this.techTickets[i].work_time = parseFloat(risultato.toFixed(2))
            });
            // console.log(this.timeWorked)
            if (this.timeWorked == 0) {

              this.timeWorked = "Nessun risultato"
            }
            this.techTickets = this.techRangeDataShowed
            this.loaded = false
          })
        });

    } else {
      alert("Inserimento date errato")
    }


  }


  changeTech(idTechToChange) {
    // console.log(idTechToChange)
    // console.log(this.dataRangeParams.value)

    this.router.navigateByUrl('/techDetail/' + idTechToChange, this.dataRangeParams.value)
    this.timeWorked = 0
    console.log(this.dataRangeParams.value)
    if (this.dataRangeParams.value.start && this.dataRangeParams.value.end) {
      console.log("okkkkkkkkkkkkkk")
      this.getRangeDate(this.dataRangeParams.value)
    }
  }

  cancelTicket(id, content) {
    this.techTickets.forEach((ticket: Ticket) => {
      if(ticket._id==id){
        ticket.isChecked=true
      }
    });
    const dialogRef = this.modalService.open(content, { centered: true })
    dialogRef.result.then((res) => {

      return this.ticketService.deleteSpecificTicket(id).subscribe(res=>{
        console.log("res")
        console.log(res)
        this.getAllTechTickets()
      });

    }, (reason) => {
      // on dismiss
      // console.log("no")
      this.techTickets.forEach((ticket: Ticket) => {
        if(ticket._id==id){
          ticket.isChecked=false
        }
      });

    });
    // dialogRef.componentInstance.id = id
  }

  // refreshPage() {
  //   var tymeout = setTimeout(function () {
  //     location.reload();
  //   }, 300000);
  //   console.log(this.refresh)
  //   if (this.refresh) {
  //     tymeout

  //   } else {

  //     clearTimeout(tymeout)

  //   }
  // }

  ngOnInit() {
    // this.refreshPage()

  }



}
