import { Component, OnInit } from '@angular/core';
import { TechsService } from 'src/app/services/techs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketsService } from 'src/app/services/tickets.service';
import { UsersService } from 'src/app/services/users.service';
import { BehaviorSubject, combineLatest, concat, forkJoin, from, merge, Observable, of, Subject } from 'rxjs';


import { exhaust, mergeAll, reduce, tap, switchMap } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-techs',
  templateUrl: './techs.component.html',
  styleUrls: ['./techs.component.scss']
})
export class TechsComponent implements OnInit {


  // => Tickets
  containerTickets: any;
  number: any;
  // => All Techs 
  allTechs$: Observable<User[]>;
  container: any;
  techHoursWorked;

  // => Tech To Edit
  techToEdit: any;
  getUsernameField() {
    return this.newTech.get('username');
  }
  getPasswordField() {
    return this.newTech.get('password');
  }
  getEmailField() {
    return this.newTech.get('email');
  }
  getStatusHolidayField() {
    return this.newTech.get('status_holiday');
  }


  // => New tech
  newTech = this.FormBuilder.group({
    username: [""],
    password: [""],
    email: ["", [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9-.]+\\.[a-z]{2,}$')
    ]],
    status_holiday: [Boolean],
    user_type: [2],
  })


  newTechData: any = {
    username: String,
    password: String,
    email: String,
    status_holiday: Boolean,
    user_type: Number,
  }

  dateRange: FormGroup;
  loaded: boolean = false


  techToEditData: any;
  refreshUser$ = new BehaviorSubject<Boolean>(true);

  constructor(private techs: TechsService, private FormBuilder: FormBuilder, private tickets: TicketsService, private users: UsersService) {
    this.container = [];
    this.containerTickets = [];
    this.number = 0;

    this.newTechData.username = "";
    this.newTechData.password = "";
    this.newTechData.email = "";
    this.newTechData.status_holiday = false;
    this.newTechData.user_type = 2;

    this.dateRange = FormBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    })

  }

  ngOnInit() {
    // this.allTechs$ = this.refreshUser$.pipe(switchMap(_ => this.getAlltechs()))
    this.allTechs$ = this.getAlltechs()
  }

  
  getAlltechs() {
    this.loaded = true
    this.techHoursWorked=0
    return this.allTechs$ = this.techs.getAlltechs().pipe(tap((tecnici) => {
      console.log(tecnici)
      var currentDate = new Date(Date.now())
      var currentMonth = currentDate.getMonth() + 1;
      var currentDay = currentDate.getDate()
      var currentyear = currentDate.getFullYear()
      // console.log( currentDate.getTime()-(30*24*3600*1000) )
      tecnici.forEach(tecnico => {
        console.log(tecnico.email)
        var jobTicket = 0;
        var jobTotal = 0
        var lastMontTickets = 0
        tecnico.tickets.forEach(techTicket => {
          var ticketUpdate = new Date(techTicket.updatedAt).getTime()

          if (ticketUpdate >= (currentDate.getTime() - (30 * 24 * 3600 * 1000))) {
            lastMontTickets++;
            // console.log(techTicket.title)
          }

          // console.log(techTicket.title)
          if (techTicket.ticket_time) {
            techTicket.ticket_time.forEach(tickethour => {
              var startjob = new Date(tickethour[0]).getTime()
              var endjob = new Date(tickethour[1]).getTime()

              jobTicket = (endjob - startjob) / (3600 * 1000)
              if (!isNaN(jobTicket) && startjob >= (currentDate.getTime() - (30 * 24 * 3600 * 1000))) {
                // console.log(tickethour[0], jobTicket)
                jobTotal += jobTicket
              }
              
            })
          }
          
        }) 
        // console.log(lastMontTickets)
        tecnico.lastMontTickets = lastMontTickets
        tecnico.hoursWorked = parseFloat(jobTotal.toFixed(2))
        this.techHoursWorked+= tecnico.hoursWorked   
        this.loaded = false

      });
    }))
  }


  getRangeDate(range) {
    console.log(range)
    this.techHoursWorked=0
    var rangeStart = new Date(range.start).getTime()
    var rangeEnd = new Date(range.end).getTime()
    if (this.dateRange.valid) {
      if (rangeEnd < rangeStart) {
        alert("inserimento date errato")

      } else {
        this.loaded = true

        return this.allTechs$ = this.techs.getAlltechs().pipe(tap((tecnici) => {
          console.log(tecnici)
          var currentDate = new Date(Date.now())
          var currentMonth = currentDate.getMonth() + 1;
          var currentDay = currentDate.getDate()
          var currentyear = currentDate.getFullYear()
          // console.log( currentDate.getTime()-(30*24*3600*1000) )
          tecnici.forEach(tecnico => {
            //  console.log(tecnico.email)
            var jobTicket = 0;
            var jobTotal = 0
            var lastMontTickets = 0
            tecnico.tickets.forEach(techTicket => {
              var ticketUpdate = new Date(techTicket.updatedAt).getTime()

              // console.log(range.start, range.end)
              if (ticketUpdate >= rangeStart && ticketUpdate <= rangeEnd) {
                lastMontTickets++;
                //  console.log(techTicket.title)
              }

              // console.log(techTicket.title)
              if (techTicket.ticket_time) {
                techTicket.ticket_time.forEach(tickethour => {
                  var startjob = new Date(tickethour[0]).getTime()
                  var endjob = new Date(tickethour[1]).getTime()

                  jobTicket = (endjob - startjob) / (3600 * 1000)
                  if (!isNaN(jobTicket) && startjob >= rangeStart && endjob <= rangeEnd) {
                    // console.log(tickethour[0], jobTicket)
                    jobTotal += jobTicket
                  }

                }) 
                
              }

            })
            // console.log(lastMontTickets)
            tecnico.lastMontTickets = lastMontTickets
            tecnico.hoursWorked = parseFloat(jobTotal.toFixed(2))
            this.techHoursWorked+=parseFloat(jobTotal.toFixed(2))
            console.log("this.techHoursWorked "+this.techHoursWorked)
            this.loaded = false

          });
        }))

      }
    } else {
      alert("Compilare tutti i campi")

    }
  }

  sendNewTech() {
    this.users.createNewUser(this.newTech.value).subscribe(res => {
      console.log(res);
      this.allTechs$ = this.refreshUser$.pipe(switchMap(_ => this.getAlltechs()))
    })


  }

  // => Edit A Tech
  editTech(id: String) {
    this.users.getSpecificUser(id)
      .subscribe(res => {
        this.techToEditData = res;
        console.log(res);
        this.newTechData.username = this.techToEditData.username;
        this.newTechData.password = this.techToEditData.password;
        this.newTechData.email = this.techToEditData.email;
        this.newTechData.status_holiday = this.techToEditData.status_holiday;
        this.newTechData.user_type = this.techToEditData.user_type;
      });
  }

  sendNewTechData() {
    this.users.updateUser(this.techToEditData._id, this.newTechData)
      .subscribe(res => {
        console.log(res);
        this.allTechs$ = this.refreshUser$.pipe(switchMap(_ => this.getAlltechs()))
      })
  }

  deleteTech(id: String) {
    this.users.deleteUser(id)
      .subscribe(res => {
        console.log(res);
        this.allTechs$ = this.refreshUser$.pipe(switchMap(_ => this.getAlltechs()))
      })
  }

}
