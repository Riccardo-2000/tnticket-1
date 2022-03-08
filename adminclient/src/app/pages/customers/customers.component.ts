import { Component, OnInit, PipeTransform, ViewChild, ElementRef, Pipe } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/services/customers.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TechsService } from 'src/app/services/techs.service';
import { Router } from '@angular/router';
import { Customer } from '../../interfaces/customer';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { fromEvent, Observable, concat } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap, tap, filter } from 'rxjs/operators';
import { TicketsService } from 'src/app/services/tickets.service';
import { __values } from 'tslib';
import { isString } from '@ng-bootstrap/ng-bootstrap/util/util';



@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [DecimalPipe]
})
export class CustomersComponent implements OnInit {
  @ViewChild('searchInput') input: ElementRef;
  files: File[] = [];
  filesUpdate: File[] = [];


  invoiceSort: boolean = true
  onsiteSort: boolean = false
  lastTicketSort: boolean = false
  startContractSort: boolean = false
 

  searchword: string
  deactivatedCustomers$: Observable<Customer[]>;
  customers$: Observable<Customer[]>;

  ticketByCustomers: any;
  filter = new FormControl('');
  term: any;
  oldcontract: boolean = false
  // => Modal
  closeResult = '';

  hourUsed: any;

  hoursToFatt = 0
  totHoursToFatt = 0
  isToInvoice: boolean

  customerToEdit: any;
  ticketsCustomer: any;
  showTickets: Boolean;
  customerWithoutContract: boolean = false
  loaded: boolean = false;




  // => Table Data
  page = 1;
  // => Search Data
  searchField: String;
  // => Customer Data
  customerToDisplay: Customer[];

  // => NewCustomerData


  company_number: String;
  company_locations: String;

  //=> CustomerContract
  customerContract: Boolean = false;
  contractHours: Number;
  contract_start: String;
  category: Number;

  ticketOperator: any;


  newCustomer: any = {
    company_name: String,
    company_reference: String,
    contract_hours: Number,
    contract_start: String,
    category: Number,
    images: Array,
  }

  numbersToAdd: any;
  locationsToAdd: any;



  sendCredentials = this.FormBuilder.group({

    username: ['', Validators.required],
    password: ['', Validators.required]


  })

  customerSelectedCredentials$: Observable<any>;
  credentialsCustomerId: string;

  constructor(private FormBuilder: FormBuilder, private customers: CustomersService, public modalService: NgbModal, private techs: TechsService, private ticketService: TicketsService, private router: Router) {
    this.numbersToAdd = [];
    this.locationsToAdd = [];
    this.customerToDisplay;
  }
  ngOnInit(): void {
    this.getAllCustomer()
    this.getDeactivatedCustomer()
    this.newCustomer.company_name = "";
    this.newCustomer.company_reference = "";
    this.newCustomer.company_number = [];
    this.newCustomer.company_locations = [];
    this.newCustomer.contract_start = "";

  }

  sort(typesort) {
    this.loaded = true
    if (typesort == "hToInvoice") {
      this.invoiceSort = !this.invoiceSort
      this.onsiteSort = false
      this.lastTicketSort = false
      this.startContractSort = false

      if (this.invoiceSort) {

        this.customers$ = this.customers$.pipe(tap(clienti => {
          clienti.sort((a, b) => Number(b.contract_hoursToFatt) - Number(a.contract_hoursToFatt));
          this.loaded = false
        }))
      } else {

        this.customers$ = this.customers$.pipe(tap(clienti => {
          clienti.sort((a, b) => Number(a.contract_hoursToFatt) - Number(b.contract_hoursToFatt));
          this.loaded = false
        }))
      }
    }
    if (typesort == "onSite") {
      this.onsiteSort = !this.onsiteSort
      this.invoiceSort = false
      this.lastTicketSort = false
      this.startContractSort = false
      if (this.onsiteSort) {

        this.customers$ = this.customers$.pipe(tap(clienti => {
          clienti.sort((a, b) => Number(b.hoursOnSite) - Number(a.hoursOnSite));
          this.loaded = false
        }))
      } else {

        this.customers$ = this.customers$.pipe(tap(clienti => {
          clienti.sort((a, b) => Number(a.hoursOnSite) - Number(b.hoursOnSite));
          this.loaded = false
        }))
      }
    }
    if (typesort == "lastTicket") {
      this.lastTicketSort = !this.lastTicketSort
      this.onsiteSort = false
      this.invoiceSort = false
      this.startContractSort = false

      if (this.lastTicketSort) {

        this.customers$ = this.customers$.pipe(tap(clienti => {
          clienti.sort((a, b) => Number(b.lastTicketDate) - Number(a.lastTicketDate));
          this.loaded = false
        }))
      } else {
        this.customers$ = this.customers$.pipe(tap(clienti => {
          clienti.sort((a, b) => Number(a.lastTicketDate) - Number(b.lastTicketDate));
          this.loaded = false
        }))

      }
    }
    if (typesort == "inizioContratto") {
      this.startContractSort = !this.startContractSort
      this.onsiteSort = false
      this.invoiceSort = false
      this.lastTicketSort = false

      if (this.startContractSort) {

        this.customers$ = this.customers$.pipe(tap(clienti => {
          clienti.sort((a, b) => (new Date(b.contract_start).getTime()) - (new Date(a.contract_start).getTime()));
          this.loaded = false
        }))
      } else {
        this.customers$ = this.customers$.pipe(tap(clienti => {
          clienti.sort((a, b) => (new Date(a.contract_start).getTime()) - (new Date(b.contract_start).getTime()));
          this.loaded = false
        }))

      }
    }

  }


  ngAfterViewInit() {
    this.searchThis()

  }

  searchThis(){
    const searchCustomer$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadCustomer(search))
      )
    const initialCustomers$ = this.getAllCustomer();
    this.customers$ = concat(initialCustomers$, searchCustomer$);
  }


  loadCustomer(search) {
    console.log("si")
    if (search != '') {
      return this.customers.customerSearch(search)
      .pipe(tap((clienti) => {
        var currentDate = new Date(Date.now())
        this.totHoursToFatt = 0
        var currentMonth = currentDate.getMonth() + 1;
        var currentDay = currentDate.getDate()
        if (!this.oldcontract) {

          var currentyear = currentDate.getFullYear()
        } else {
          var currentyear = currentDate.getFullYear() - 1

        }

        clienti.forEach(cliente => {


          var risultato = 0
          this.hoursToFatt = 0
          var ticketonsite = 0;
          var startContract = cliente.contract_start
          var endcontract = ''
          this.isToInvoice = false
          cliente.tickets.forEach((clienteTicket, i) => {

            var somma = 0
            var isonsite = false




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



              var temporaryEndContract = endcontract.split("-")
              endcontract = temporaryEndContract[2]?.concat("-" + (temporaryEndContract[1] + "-" + temporaryEndContract[0]))
            }



            clienteTicket.ticket_time.forEach(clienteTicketTime => {

              var startjob = new Date(clienteTicketTime[0]).getTime()
              var endjob = new Date(clienteTicketTime[1]).getTime()
              if (startContract) {//se il cliente ha il contratto
                var startContractinv = startContract.split("-")
                var temporaryStartContract: string = ''
                temporaryStartContract = startContractinv[2]?.concat("-" + (startContractinv[1] + "-" + startContractinv[0]))

                if (startjob >= (Date.parse(temporaryStartContract)) && (startjob < new Date(endcontract).getTime())) {



                  somma = (endjob - startjob) / (3600 * 1000)
                  if (isNaN(somma)) {
                    somma = 0
                  }
                  risultato = risultato + somma;
                  if (cliente.contract_hours && risultato > cliente.contract_hours && !clienteTicket.ticket_fatturazione) {
                    if (clienteTicket.ticket_fatturazione != "fatturato" && clienteTicket.ticket_fatturazione != "a contratto") {

                      this.isToInvoice = true
                    }
                    this.hoursToFatt += somma
                    if (clienteTicket.external) {
                      isonsite = true
                    }
                  }

                }

                
              }
              else { //se non è cliente a contratto

                if (new Date(clienteTicketTime[0]).getFullYear() >= currentyear - 1 && !clienteTicket.ticket_fatturazione) {
                  somma = (endjob - startjob) / (3600 * 1000)
                  if (isNaN(somma)) {
                    somma = 0
                  }
                  this.hoursToFatt += somma
                  if (clienteTicket.ticket_fatturazione != "fatturato" && clienteTicket.ticket_fatturazione != "a contratto") {
                    
                    this.isToInvoice = true
                  }
                  if (clienteTicket.external) {
                    isonsite = true
                  }
                  
                }
              }
            });
            if (isonsite) {
              ticketonsite++
            }
            if (Object.is(cliente.tickets.length - 1, i)) {
              // execute last item logic
              cliente.lastTicketDate = new Date(clienteTicket.createdAt)
            }

          });

          
          cliente.contract_hoursToFatt = parseFloat(this.hoursToFatt.toFixed(2))
          if (!this.customerWithoutContract && cliente.contract_hours > 0 && this.isToInvoice) {
            this.totHoursToFatt += parseFloat(this.hoursToFatt.toFixed(2))
          }
          else if (this.customerWithoutContract && !cliente.contract_hours && this.isToInvoice) {
            this.totHoursToFatt += parseFloat(this.hoursToFatt.toFixed(2))
            if (this.hoursToFatt > 0) {

            }

          }
          cliente.hoursused = parseFloat(risultato.toFixed(2))
          cliente.hoursOnSite = ticketonsite
          if (startContract) {

            var splitDate = startContract.split('-')
            // console.log(startContract.split('-'))
            var temporaryStartContract = splitDate[2]?.concat("-" + (splitDate[1] + "-" + splitDate[0]))
            // console.log(splitDate[2], splitDate[1], splitDate[0],temporaryStartContract)
            startContract = new Date(temporaryStartContract);
          }
          cliente.contract_start = startContract

          // console.log(cliente.company_name)
          // console.log(startContractDate)



          clienti.sort((a, b) => Number(b.contract_hoursToFatt) - Number(a.contract_hoursToFatt));
          // console.log(clienti)
          this.loaded = false

        });




      }), map(clienti => !this.customerWithoutContract ? clienti.filter(cliente => cliente.contract_hours > 0) : clienti.filter(cliente => !cliente.contract_hours)));

    }else{
      this.searchThis()
    }

    // this.ngAfterViewInit()
    return (this.customers$ = this.getAllCustomer().pipe(tap(res=>{if(res){this.searchThis()}})));
  }


  // => Get ALL Customers
  getAllCustomer() {
    this.loaded = true



    return this.customers$ = this.customers.getAllCustomers()
      .pipe(tap((clienti) => {
        var currentDate = new Date(Date.now())
        this.totHoursToFatt = 0
        var currentMonth = currentDate.getMonth() + 1;
        var currentDay = currentDate.getDate()
        if (!this.oldcontract) {

          var currentyear = currentDate.getFullYear()
        } else {
          var currentyear = currentDate.getFullYear() - 1

        }

        clienti.forEach(cliente => {


          var risultato = 0
          this.hoursToFatt = 0
          var ticketonsite = 0;
          var startContract = cliente.contract_start
          var endcontract = ''
          this.isToInvoice = false
          cliente.tickets.forEach((clienteTicket, i) => {

            var somma = 0
            var isonsite = false




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



              var temporaryEndContract = endcontract.split("-")
              endcontract = temporaryEndContract[2]?.concat("-" + (temporaryEndContract[1] + "-" + temporaryEndContract[0]))
            }



            clienteTicket.ticket_time.forEach(clienteTicketTime => {

              var startjob = new Date(clienteTicketTime[0]).getTime()
              var endjob = new Date(clienteTicketTime[1]).getTime()
              if (startContract) {//se il cliente ha il contratto
                var startContractinv = startContract.split("-")
                var temporaryStartContract: string = ''
                temporaryStartContract = startContractinv[2]?.concat("-" + (startContractinv[1] + "-" + startContractinv[0]))

                if (startjob >= (Date.parse(temporaryStartContract)) && (startjob < new Date(endcontract).getTime())) {



                  somma = (endjob - startjob) / (3600 * 1000)
                  if (isNaN(somma)) {
                    somma = 0
                  }
                  risultato = risultato + somma;
                  if (cliente.contract_hours && risultato > cliente.contract_hours && !clienteTicket.ticket_fatturazione) {
                    if (clienteTicket.ticket_fatturazione != "fatturato" && clienteTicket.ticket_fatturazione != "a contratto") {

                      this.isToInvoice = true
                    }
                    this.hoursToFatt += somma
                    if (clienteTicket.external) {
                      isonsite = true
                    }
                  }

                }

                
              }
              else { //se non è cliente a contratto

                if (new Date(clienteTicketTime[0]).getFullYear() >= currentyear - 1 && !clienteTicket.ticket_fatturazione) {
                  somma = (endjob - startjob) / (3600 * 1000)
                  if (isNaN(somma)) {
                    somma = 0
                  }
                  this.hoursToFatt += somma
                  if (clienteTicket.ticket_fatturazione != "fatturato" && clienteTicket.ticket_fatturazione != "a contratto") {
                    
                    this.isToInvoice = true
                  }
                  if (clienteTicket.external) {
                    isonsite = true
                  }
                  
                }
              }
            });
            if (isonsite) {
              ticketonsite++
            }
            if (Object.is(cliente.tickets.length - 1, i)) {
              // execute last item logic
              cliente.lastTicketDate = new Date(clienteTicket.createdAt)
            }

          });

          
          cliente.contract_hoursToFatt = parseFloat(this.hoursToFatt.toFixed(2))
          if (!this.customerWithoutContract && cliente.contract_hours > 0 && this.isToInvoice) {
            this.totHoursToFatt += parseFloat(this.hoursToFatt.toFixed(2))
          }
          else if (this.customerWithoutContract && !cliente.contract_hours && this.isToInvoice) {
            this.totHoursToFatt += parseFloat(this.hoursToFatt.toFixed(2))
            if (this.hoursToFatt > 0) {

            }

          }
          cliente.hoursused = parseFloat(risultato.toFixed(2))
          cliente.hoursOnSite = ticketonsite
          if (startContract) {

            var splitDate = startContract.split('-')
            // console.log(startContract.split('-'))
            var temporaryStartContract = splitDate[2]?.concat("-" + (splitDate[1] + "-" + splitDate[0]))
            // console.log(splitDate[2], splitDate[1], splitDate[0],temporaryStartContract)
            startContract = new Date(temporaryStartContract);
          }
          cliente.contract_start = startContract

          // console.log(cliente.company_name)
          // console.log(startContractDate)



          clienti.sort((a, b) => Number(b.contract_hoursToFatt) - Number(a.contract_hoursToFatt));
          // console.log(clienti)
          this.loaded = false

        });




      }), map(clienti => !this.customerWithoutContract ? clienti.filter(cliente => cliente.contract_hours > 0) : clienti.filter(cliente => !cliente.contract_hours)));



  }


  getDeactivatedCustomer() {

    return this.deactivatedCustomers$ = this.customers.getDeactivatedCustomers()
  }

  changeContract() {
    this.customerWithoutContract = !this.customerWithoutContract
    this.customers$ = this.getAllCustomer()
    this.ngAfterViewInit()
  }

  customerDisable(customerId) {
    this.customers.disableCustomer(customerId)
    this.getAllCustomer()
    this.getDeactivatedCustomer()
  }
  customerRiable(customerId) {
    this.customers.ableCustomer(customerId)
    this.getAllCustomer()
    this.getDeactivatedCustomer()
  }

  addNumbers() {
    this.numbersToAdd.push(this.company_number);
    if (this.customerToEdit) {
      this.customerToEdit.company_number.push(this.numbersToAdd);
    } else {
      this.newCustomer.company_number = this.numbersToAdd;
    }
    this.company_number = "";
  }
  addLocations() {
    this.locationsToAdd.push(this.company_locations);
    if (this.customerToEdit) {
      this.customerToEdit.company_locations.push(this.locationsToAdd);
    } else {
      this.newCustomer.company_locations = this.locationsToAdd;
    }
    this.company_locations = "";
  }


  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    console.log(this.files);
    this.readFile(this.files[0]).then(fileContents => {
      // Put this string in a request body to upload it to an API.
      console.log(fileContents);
    }
    )
  }
  readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }
  onSelectUpdate(event) {
    console.log(event);
    this.filesUpdate.push(...event.addedFiles);
    console.log(this.filesUpdate);
    this.readFileUpdate(this.filesUpdate[0]).then(fileContents => {
      // Put this string in a request body to upload it to an API.
      console.log(fileContents);
    }
    )
  }
  readFileUpdate(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  onRemoveUpdate(event) {
    console.log(event);
    this.filesUpdate.splice(this.files.indexOf(event), 1);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  // => Create New Customer
  createNewCustomer() {
    const today: string = new Date().toLocaleDateString();
    this.newCustomer.company_number = this.numbersToAdd;
    this.newCustomer.company_locations = this.locationsToAdd;
    this.newCustomer.contract_hours = this.contractHours;
    this.newCustomer.category = this.category;
    this.newCustomer.contract_start = this.contract_start;
    console.log(this.newCustomer);
    const fd: any = new FormData();
    this.filesUpdate.forEach((file) => {
      fd.append('images[]', file);
    });
    fd.append('company_name', this.newCustomer.company_name);
    fd.append('company_reference', this.newCustomer.company_reference);
    fd.append('company_number', this.newCustomer.company_number);
    fd.append('company_locations', this.newCustomer.company_locations);
    fd.append('category', this.newCustomer.category);
    if (this.customerContract === true) {
      fd.append('contract_hours', this.newCustomer.contract_hours);
      fd.append('contract_start', this.newCustomer.contract_start);

    } else {
      fd.append('contract_hours', this.newCustomer.contract_hours = 0);
      fd.append('contract_start', today);
    }
    this.customers.newCustomer(fd)
      .subscribe(res => {
        console.log(res);
      })
    // this.customerToDisplay.push(this.newCustomer);







  }

  // => Delete A Customer
  deleteCustomer(id: String, index) {
    this.customers.deleteCustomer(id)
      .subscribe(res => {
        console.log(res);
      })
    this.customerToDisplay.splice(index, 1);
    console.log(index);

  }

  sendNewCredentials() {


    this.customers.createAndEditCredentials(this.credentialsCustomerId, this.sendCredentials.value)
      .subscribe(res => console.log(res))
    return this.modalService.dismissAll()

  }

  openCredentials(credentials, id: string, kind) {

    this.credentialsCustomerId = id;

    this.modalService.open(credentials, { size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {

      this.credentialsCustomerId = '';
      console.log(this.credentialsCustomerId);

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  // => Modal Logic
  open(content, id: String, kind) {
    this.showTickets = kind;
    this.customers.getSpecificCustomer(id)
      .subscribe(res => {
        console.log(res);
        this.customerToEdit = res;
        if (kind === false) {
          this.customerToEdit.tickets.map(x => {
            x.createdAt = x.createdAt.slice(0, 10);
            this.techs.getSpecificTech(x.operator_id)
              .subscribe(res => {
                this.ticketOperator = res;
                x.operator_name = this.ticketOperator.username;
              })
          })
        }
      })
    this.modalService.open(content, { size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  deleteNumber(index) {
    console.log(index);

    if (this.customerToEdit) {
      this.customerToEdit.company_numbers.splice(index, 1);
    } else {
      this.numbersToAdd.splice(index, 1);
    }

  }
  deleteLocation(index) {
    console.log(index);

    if (this.customerToEdit) {
      this.customerToEdit.company_locations.splice(index, 1);
    } else {
      this.locationsToAdd.splice(index, 1);
    }
  }

  oldYearContract() {
    this.oldcontract = !this.oldcontract
    this.loaded = true
    this.customers$ = this.getAllCustomer().pipe(tap(res => {
      if (res) {

        this.loaded = false
      }
    }))
    this.ngAfterViewInit()

  }


  updateCustomer() {
    console.log(this.customerToEdit);
    let customerId = this.customerToEdit._id;
    delete this.customerToEdit._id;
    console.log(customerId);
    const fd: any = new FormData();
    this.files.forEach((file) => {
      fd.append('images[]', file);
    });
    fd.append('company_name', this.customerToEdit.company_name);
    fd.append('company_reference', this.customerToEdit.company_reference);
    fd.append('company_number', this.customerToEdit.company_number);
    fd.append('company_locations', this.customerToEdit.company_locations);
    fd.append('contract_start', this.customerToEdit.contract_start);
    fd.append('category', this.customerToEdit.category);
    if (this.customerToEdit.contract_hours > 0) {
      fd.append('contract_hours', this.customerToEdit.contract_hours);

    } else {
      fd.append('contract_hours', this.customerToEdit.contract_hours = 0);
    }
    this.customers.updateCustomer(customerId, fd)
      .subscribe(res => {
        console.log(res);
      })
    this.customerToEdit = [];
    this.modalService.dismissAll();
  }


  // searchCustomer() {
  //   let container: any;

  //   this.customers.customerSearch(this.searchField)
  //     .subscribe(res => {
  //       container = res;
  //       this.customerToDisplay.push(container);
  //     })
  // }


  cancelSearch() {
    this.searchField = "";
    this.getAllCustomer();
  }

  goToTicketsAndFill(id: String) {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/tickets', { state: { id: id } });
  }

  goToTicketsAndCreate(id: String) {
    this.router.navigateByUrl('/tickets', { state: { customerId: id } });
  }
  deleteImageFromArray(index) {
    this.customerToEdit.images.splice(index, 1);
    console.log(this.customerToEdit.images);
  }

}
