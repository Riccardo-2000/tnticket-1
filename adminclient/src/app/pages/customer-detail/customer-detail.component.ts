import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/interfaces/customer';
import { Ticket } from 'src/app/interfaces/ticket';
import { User } from 'src/app/interfaces/user';
import { CustomersService } from 'src/app/services/customers.service';
import { UsersService } from 'src/app/services/users.service';
import { ignoreElements } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  // content: TemplateRef<any>
  customerId;
  oldcontract: string
  currentCustomer: Customer;
  customerTickets: Ticket[] = [];
  onsiteTickets
  operatorTickets: User
  totHoursWorked = 0
  hoursToFatt = 0
  isSelected: boolean = false;
  loaded: boolean = false;

  todaydate: Date = new Date(Date.now())

  @ViewChild('htmlData') htmlData: ElementRef;

  downloadPDF(CustomerName): void {
    document.getElementById('htmlData').classList.remove('collapse');
    let DATA = document.getElementById('htmlData')
    html2canvas(DATA, {}).then(canvas => {

      let imgWidth = 280;
      let pageHeight = 190;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;


      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('l', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 10, 10, imgWidth, imgHeight)
      // PDF.text('Page ', PDF.internal.pageSize.width / 2, 200, {
      //   align: 'center'
      // })
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        PDF.addPage();
        PDF.addImage(FILEURI, 'PNG', 10, position, imgWidth, imgHeight);
        // PDF.text('Page ', PDF.internal.pageSize.width / 2, 200, {
        //   align: 'center'
        // })
        heightLeft -= pageHeight;
      }

      PDF.save('fattura_' + CustomerName + '.pdf');
    });

    document.getElementById('htmlData').classList.add('collapse');

  }

  toggleAll() {
    this.isSelected = !this.isSelected
    this.customerTickets.forEach(ticket => {
      ticket.isChecked = this.isSelected
      console.log(ticket.title, ticket.isChecked)
    });
  }

  optionToggled(idTicket) {
    this.customerTickets.forEach(ticket => {
      if (ticket._id == idTicket) {
        ticket.isChecked = ticket.isChecked
        console.log(ticket.title, ticket.isChecked)
      }
    });
  }




  constructor(private customerService: CustomersService, private route: ActivatedRoute, private userService: UsersService, private modalService: NgbModal, private dialog: MatDialog) {


    route.params.subscribe(
      (params) => {
        var id = params['id'];
        this.customerId = params['id'];
        this.oldcontract = params['oldcontract'];
        this.getTicketToInvoice(this.customerId)





      })
  }

  invoiceMultipleTicket(content, invoiceType) {

    const dialogRef = this.modalService.open(content, { centered: true }).result.then((res) => {
      // console.log("si")
      this.customerTickets.forEach(ticket => {
        if (ticket.isChecked) {
          // console.log(ticket.title)
          this.customerService.ticketToInvoice(ticket._id, invoiceType).subscribe(res => {
            //  console.log(res)
          })
        }
      });
      this.getTicketToInvoice(this.currentCustomer._id)
    }, (reason) => {
      // on dismiss
      // console.log("no")

    });
  }

  invoiceSingleTicket(content, ticketid, typeInvoice) {
    this.customerTickets.forEach(ticket => {
      if (ticket._id == ticketid) {
        ticket.isChecked = true
      }
    });
    const dialogRef = this.modalService.open(content, { centered: true }).result.then((res) => {
      // console.log("si")
      this.customerService.ticketToInvoice(ticketid, typeInvoice).subscribe(res => {
      })
      this.getTicketToInvoice(this.currentCustomer._id)

    }, (reason) => {
      // on dismiss
      this.customerTickets.forEach(ticket => {
        if (ticket._id == ticketid) {
          ticket.isChecked = false
        }

      });

    });


  }

  getTicketToInvoice(customerId) {
    this.customerTickets = []
    this.onsiteTickets = 0
    this.loaded = true
    this.customerService.getSpecificCustomer(customerId).subscribe((cliente: Customer) => {
      this.totHoursWorked = 0
      var currentDate = new Date(Date.now())
      var currentMonth = currentDate.getMonth() + 1;
      var currentDay = currentDate.getDate()
      // console.log(this.oldcontract, currentDate)
      if (this.oldcontract == 'false') {//ticket nuovo contratto

        var currentyear = currentDate.getFullYear()
      } else {//ticket vecchio contratto
        var currentyear = currentDate.getFullYear() - 1

      }
      // console.log(currentyear)
      this.currentCustomer = cliente

      if (cliente.contract_hours > 0) {//se  ha contratto


        cliente.tickets.forEach(ticket => {
          var totMinWorked = 0
          var isToFatt = false
          var minutes = 0
          var startContract = cliente.contract_start
          var endcontract = ''

          if (typeof (startContract) == "string" && startContract.length <= 5) {


            var startDateContract = startContract.split("-")
            var day = startDateContract[0];
            var month = startDateContract[1];


            if (currentMonth < Number(month)) {

              startContract = cliente.contract_start?.concat("-" + (currentyear - 1))
              endcontract = cliente.contract_start?.concat("-" + (currentyear))
            } else if (currentMonth == Number(month)) {
              if (currentDay <= Number(day)) {
                startContract = cliente.contract_start?.concat("-" + (currentyear - 1))
                endcontract = cliente.contract_start?.concat("-" + (currentyear))

              } else {

                startContract = cliente.contract_start?.concat("-" + (currentyear))
                endcontract = cliente.contract_start?.concat("-" + (currentyear + 1))
              }
            } else {
              startContract = cliente.contract_start?.concat("-" + (currentyear))
              endcontract = cliente.contract_start?.concat("-" + (currentyear + 1))

            }



            var startContractinv = startContract.split("-")
            var temporaryStartContract: string = ''
            temporaryStartContract = startContractinv[2]?.concat("-" + (startContractinv[1] + "-" + startContractinv[0]))
            var temporaryEndContract = endcontract.split("-")
            endcontract = temporaryEndContract[2]?.concat("-" + (temporaryEndContract[1] + "-" + temporaryEndContract[0]))

          }

          ticket.ticket_time.forEach(time => {
            var startjob = new Date(time[0]).getTime()
            var endjob = new Date(time[1]).getTime()



            if (startjob >= (Date.parse(temporaryStartContract))) {

              if (endjob > startjob) {

                minutes = (endjob - startjob) / (60 * 1000)
              }
              if (!isNaN(minutes)) {
                totMinWorked += minutes
              }
              this.totHoursWorked += minutes

            }
          })


          ticket.work_time = totMinWorked


          if ((this.totHoursWorked / 60) > cliente.contract_hours && ticket.ticket_fatturazione != "fatturato" && ticket.ticket_fatturazione != "a contratto" && new Date(ticket.createdAt).getFullYear() >= (currentyear - 1) && ticket.work_time > 0 && (new Date(ticket.createdAt).getTime()<new Date(endcontract).getTime())) {
            if (ticket.external && totMinWorked) {//incremento ore ticket on site

              this.onsiteTickets++

            }
            this.hoursToFatt += totMinWorked
            ticket.isChecked = false
            this.customerTickets.push(ticket)
          }
          this.loaded = false
        })
      } else {//se non ha contratto

        cliente.tickets.forEach(ticket => {
          var totMinWorked = 0
          var isToFatt = false
          var minutes = 0
          var startContract = cliente.contract_start

          ticket.ticket_time.forEach(time => {
            var startjob = new Date(time[0]).getTime()
            var endjob = new Date(time[1]).getTime()



            if (new Date(time[0]).getFullYear() >= (currentyear - 1) && !ticket.ticket_fatturazione) {
              minutes = (endjob - startjob) / (60 * 1000)
              if (!isNaN(minutes)) {
                totMinWorked += minutes
                this.totHoursWorked += minutes
              }
              isToFatt = true

            }
          })
          if (isToFatt) {
            if (ticket.external && totMinWorked) {//incremento ore ticket on site
              this.onsiteTickets++

            }
            this.hoursToFatt += totMinWorked
            ticket.isChecked = false
            this.customerTickets.push(ticket)
            ticket.work_time = totMinWorked
          }



          this.loaded = false
        })
      }


      this.customerTickets.sort((a, b) => Number(a.ticket_number) - Number(b.ticket_number));
      this.hoursToFatt = parseFloat((this.hoursToFatt / 60).toFixed(2))
    })
  }



  ngOnInit(): void {
  }

}
