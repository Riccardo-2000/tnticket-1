import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { interval, Observable } from 'rxjs';
import { Customer } from '../interfaces/customer';
import { url } from '../../environments/environment'
import { filter, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {


  hoursToFatt = 0
  loaded: boolean = false;

  url: String;
  constructor(private HttpClient: HttpClient) {
    //this.url = 'https://ticket.tnsolutions.it:4399/';
    this.url = url;
  }


  getSpecificCustomer(id: String) {
    return this.HttpClient.get(this.url + 'customer/' + id)
  }


  getAllCustomers(): Observable<Customer[]> {

    return this.HttpClient.get<Customer[]>(this.url + 'customers')
  }


  customerSearch(term: String): Observable<Customer[]> {

    return this.HttpClient.get<Customer[]>(this.url + 'customers/search/' + term)
      // .pipe(tap((clienti) => {
      //   var currentDate = new Date(Date.now())
      //   var currentMonth = currentDate.getMonth() + 1;
      //   var currentDay = currentDate.getDate()
      //   var currentyear = currentDate.getFullYear()

      //   clienti.forEach(cliente => {


      //     var somma = 0
      //     var risultato = 0
      //     this.hoursToFatt = 0
      //     var ticketonsite = 0;
      //     var startContract = cliente.contract_start
      //     cliente.tickets.forEach((clienteTicket, i) => {

      //       var isonsite = false



      //       if (typeof (startContract) == "string" && startContract.length <= 5) {


      //         var startDateContract = startContract.split("-")
      //         var day = startDateContract[0];
      //         var month = startDateContract[1];


      //         if (currentMonth < Number(month)) {

      //           startContract = cliente.contract_start?.concat("-" + (currentyear - 1))
      //         } else if (currentMonth == Number(month)) {
      //           if (currentDay <= Number(day)) {
      //             startContract = cliente.contract_start?.concat("-" + (currentyear - 1))

      //           } else {

      //             startContract = cliente.contract_start?.concat("-" + (currentyear))
      //           }
      //         } else {
      //           startContract = cliente.contract_start?.concat("-" + (currentyear))

      //         }

      //       }


      //       clienteTicket.ticket_time.forEach(clienteTicketTime => {

      //         var startjob = new Date(clienteTicketTime[0]).getTime()
      //         var endjob = new Date(clienteTicketTime[1]).getTime()




      //         if (startContract) {
      //           var startContractinv = startContract.split("-")
      //           var temporaryStartContract: string = ''
      //           temporaryStartContract = startContractinv[2]?.concat("-" + (startContractinv[1] + "-" + startContractinv[0]))

      //           if (startjob >= (Date.parse(temporaryStartContract))) {


      //             // console.log(endjob - startjob)

      //             somma = (endjob - startjob) / (3600 * 1000)
      //             if (isNaN(somma)) {
      //               somma = 0
      //             }
      //             risultato = risultato + somma;
      //             if (cliente.contract_hours && risultato > cliente.contract_hours && !clienteTicket.ticket_fatturazione) {
      //               this.hoursToFatt += somma
      //             }

      //             if (clienteTicket.external) {
      //               isonsite = true
      //             }


      //           }

      //         }
      //         else { //se non è cliente a contratto


      //           if (new Date(clienteTicketTime[0]).getFullYear() >= 2021 && !clienteTicket.ticket_fatturazione) {
      //             somma = (endjob - startjob) / (3600 * 1000)
      //             if (isNaN(somma)) {
      //               somma = 0
      //             }
      //             this.hoursToFatt += somma
      //             if (clienteTicket.external) {
      //               isonsite = true
      //             }
      //           }


      //         }


      //       });


      //       if (isonsite) {
      //         ticketonsite++
      //       }



      //       if (Object.is(cliente.tickets.length - 1, i)) {
      //         // execute last item logic
      //         cliente.lastTicketDate = new Date(clienteTicket.createdAt)
      //       }

      //     });


      //     cliente.contract_hoursToFatt = parseFloat(this.hoursToFatt.toFixed(2))
      //     cliente.hoursused = parseFloat(risultato.toFixed(2))
      //     cliente.hoursOnSite = ticketonsite
      //     if (startContract) {

      //       var splitDate = startContract.split('-')
      //       // console.log(startContract.split('-'))
      //       var temporaryStartContract = splitDate[2]?.concat("-" + (splitDate[1] + "-" + splitDate[0]))
      //       // console.log(splitDate[2], splitDate[1], splitDate[0],temporaryStartContract)
      //       startContract = new Date(temporaryStartContract);
      //     }
      //     cliente.contract_start = startContract

      //     // console.log(cliente.company_name)
      //     // console.log(startContractDate)



      //     clienti.sort((a, b) => Number(b.contract_hoursToFatt) - Number(a.contract_hoursToFatt));
      //     // console.log(clienti)
      //   });




      // }));
  }
  getDeactivatedCustomers() {

    return this.HttpClient.get<Customer[]>(this.url + 'customersDeactivated')
  }

  disableCustomer(customerId) {

    this.HttpClient.post(this.url + 'disableCustomer', { customerId: customerId }).subscribe(res => {
    });

  }
  ableCustomer(customerId) {

    this.HttpClient.post(this.url + 'ableCustomer', { customerId: customerId }).subscribe(res => {
    });

  }

  ticketToInvoice(ticketId, fatturazione_status) {
    return this.HttpClient.post(this.url + 'fatturazione/' + ticketId, { ticket_fatturazione: fatturazione_status })
  }



  newCustomer(data: Object) {
    return this.HttpClient.post(this.url + 'customers', data);
  }
  deleteCustomer(id: String) {
    return this.HttpClient.delete(this.url + 'customer/' + id);
  }
  updateCustomer(id: String, newData: Object) {
    return this.HttpClient.post(this.url + 'customer/' + id, newData);
  }
  createAndEditCredentials(customerId: string, payload): Observable<Customer> {

    return this.HttpClient.post<Customer>(this.url + 'dash/customer/credentials/' + customerId, payload)

  }

}
