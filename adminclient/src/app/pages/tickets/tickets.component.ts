import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { TechsService } from 'src/app/services/techs.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { StatusesService } from 'src/app/services/statuses.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from './../../interfaces/ticket';
import { Observable, fromEvent, concat } from 'rxjs';
import { map, tap, debounceTime, distinctUntilChanged, switchMap, filter, concatMap } from 'rxjs/operators';
import { StoreService } from './../../store/store.service';


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  @ViewChild('content', { static: false }) private content;
  @ViewChild('searchInput') input: ElementRef;

  files: File[] = [];
  startTemp: any
  endTemp: any
  collabWithTemp: any
  ticket_times: any;
  ticket_times_stringify: any;
  // Parameter
  idToModify: String;
  customerIToCreate: String;

  ticketIdToEdit:string
  ticketToDelete:Ticket

  page = 1;

  loaded:boolean = false

  flag: Boolean;
  withoutTech: Boolean=true;
  // => AllTicketsLogic
  closeResult = '';
  ticketsToDisplay: any;
  customerData: any;
  operatorData: any;
  statuses: any;
  categories: any;
  // => ModalLogic
  specificTicket: any;
  specificModalCustomer: any;
  specificModalTechs: any
  specificAddedBy: any;

  // => TicketToEditLogic
  ticketEdit: any;
  allCustomers: any;
  allTechs: any;
  customerEdit: any;
  techEdit: any;
  addedByEdit: any;

  // => SearchLogic
  searchField: String;


  //=> CustomerIDModel
  customerIdModel: String;

  //=> Filters
  FilterByPriority: any;
  dateOne: any;
  dateTwo: any;


  getSearchTitle() {
    return this.searchData.get('titleSearch');
  }

  searchData :FormGroup


  // => CreateTicketLogic
  geTtitleEdit() {
    return this.newTicketData.get('title');
  }
  getDescription() {
    return this.newTicketData.get('description');
  }
  getInsertDate() {
    return this.newTicketData.get('insert_date');
  }
  getCustomerId() {
    return this.newTicketData.get('customer_id');
  }
  getCompanyLocations() {
    return this.newTicketData.get('company_locations');
  }
  getExternal() {
    return this.newTicketData.get('external');
  }
  getOperatorId() {
    return this.newTicketData.get('operator_id');
  }
  getPriority() {
    return this.newTicketData.get('priority');
  }
  getStatus() {
    return this.newTicketData.get('status');
  }
  getNote() {
    return this.newTicketData.get('note');
  }
  getCategory() {
    return this.newTicketData.get('category');
  }


  newTicketData = this.formBuilder.group({
    title: "",
    description: "",
    ticket_date: "",
    customer_id: "",
    external: true,
    operator_id: "",
    priority: "",
    status: "",
    note: "",
    category: "",
    added_by: "",
    ticket_time: [],
    images: [[]],
    ticket_mode: [],
    customer_sign: [""],
    ticket_reference_name: "",
    ticket_reference_number: "",
    ticket_reference_location: ""
  });

  geTtitleEditUpdate() {
    return this.updateTicket.get('title');
  }
  getDescriptionUpdate() {
    return this.updateTicket.get('description');
  }
  getInsertDateUpdate() {
    return this.updateTicket.get('insert_date');
  }
  getCustomerIdUpdate() {
    return this.updateTicket.get('customer_id');
  }
  getCompanyLocationsUpdate() {
    return this.updateTicket.get('company_locations');
  }
  getExternalUpdate() {
    return this.updateTicket.get('external');
  }
  getOperatorIdUpdate() {
    return this.updateTicket.get('operator_id');
  }
  getPriorityUpdate() {
    return this.updateTicket.get('priority');
  }
  getStatusUpdate() {
    return this.updateTicket.get('status');
  }
  getNoteUpdate() {
    return this.updateTicket.get('note');
  }
  getCategoryUpdate() {
    return this.updateTicket.get('category');
  }






  updateTicket = this.formBuilder.group({
    title: [""],
    description: [""],
    ticket_date: [""],
    customer_id: [""],
    company_locations: [""],
    external: [true],
    operator_id: [""],
    priority: [""],
    status: [""],
    note: [""],
    category: [""]

  })


  model: any = {
    title: String,
    description: String,
    ticket_date: Date,
    customer_id: String,
    company_locations: Array,
    external: Boolean,
    priority: String,
    status: String,
    category: String,
    operator_id: String,
    note: String,
    images: Array,
    ticket_reference_name: String,
    ticket_reference_number: String,
    ticket_reference_location: String,
    ticket_time: Array
  }
  start: any
  end: any
  collab: any;

  //  => Observables
  allTickets$: Observable<Ticket[]>

  constructor(private tickets: TicketsService, private customer: CustomersService, private techs: TechsService,
    public modalService: NgbModal, private formBuilder: FormBuilder, private user: UsersService, private status: StatusesService, private category: CategoriesService, private activeroute: ActivatedRoute, private router: Router, private store: StoreService, private ticketService: TicketsService) {
    this.ticketsToDisplay = [];
    this.ticket_times = [];
    this.ticket_times_stringify = []
    this.searchData = formBuilder.group({
      titleSearch: [""],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
  
    })
  }

  ngOnInit() {
    this.getAllTickets()
    
    
    this.getAllCustomer();
    this.getAllTechs();
    this.getStatuses();
    this.getCategories();
    this.idToModify = history.state.id;

  }
  ngAfterViewChecked() {

    this.customerIToCreate = history.state.customerId;
    this.getIdAndCreateTicketByCustomer(this.customerIToCreate);
  }
  ngAfterViewInit() {

    if (this.idToModify) {
      console.log(this.content);
      this.open(this.content, this.idToModify);
    }
    const searchTicket$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadTickets(search))
      )
    const initialTickets$ = this.getAllTickets();
    this.allTickets$ = concat(initialTickets$, searchTicket$); //cambiare nome per la ricerca per rotella
  }

  getAllTickets(): Observable<Ticket[]> {
    // console.log(this.tickets.getAllTickets().subscribe(res=>(
    //   console.log(res)
    // )))
    
    this.loaded = true
    if(this.withoutTech){
      
      return this.allTickets$ = this.tickets.getAllTickets().pipe(tap(res=>{
        if(res){
          
          this.loaded = false
        }
      }))
    }else{
      
      
      return this.allTickets$ = this.tickets.getNotAssignedTickets().pipe(tap(res=>{
        if(res){
          
          this.loaded = false
        }
      }))

    }
  }

  showNoTechTickets(){
    this.withoutTech= !this.withoutTech
    this.allTickets$ = this.getAllTickets().pipe(tap(res=>{
      if(res){
        this.loaded=false
      }
    }));
  }

  loadTickets(search = ''): Observable<Ticket[]> {
    if (search != '') {
      return this.tickets.getTicketBySearch(search)
        .pipe(
          map(tickets => tickets.filter(tickets => tickets.status != "Risolto"))
        );
    }
    return this.getAllTickets();
  }
  filterByPriority(e) {
    this.allTickets$ = this.tickets.getAllTickets()
      .pipe(
        map(tickets => tickets.filter(tickets => tickets.priority == e))
      )
  }
  search(formSearchValue) {
    if((formSearchValue.startDate>=formSearchValue.endDate) ){
      alert("Inserimento data errata")
    }else{
      if(formSearchValue.titleSearch!=''){

        this.allTickets$ = this.getAllTickets().pipe(map(tickets=> tickets.filter(ticket=>ticket.ticket_number==formSearchValue.titleSearch)))
      }else if(formSearchValue.startDate && formSearchValue.endDate){
        this.allTickets$ = this.getAllTickets().pipe(map(tickets=> tickets.filter(ticket=> (ticket.createdAt>=formSearchValue.startDate && ticket.createdAt<=formSearchValue.endDate))))
  
      }else{
        this.allTickets$ = this.getAllTickets()
      }
    }
    
  }
  cancelTicket(id, content) {
    this.allTickets$.pipe(tap(tickets=> {
      tickets.forEach((ticket: Ticket) => {
        if(ticket._id==id){
          // ticket.isChecked=true
          console.log(ticket)
          this.ticketToDelete=ticket
        }
      });
    }))
    const dialogRef = this.modalService.open(content, { centered: true })
    dialogRef.result.then((res) => {

      return this.ticketService.deleteSpecificTicket(id).subscribe(res=>{
        
        this.getAllTickets()
      });

    }, (reason) => {
      // on dismiss
      // console.log("no")
      this.allTickets$.pipe(tap(tickets=> {
        tickets.forEach((ticket: Ticket) => {
          if(ticket._id==id){
            ticket.isChecked=false
          }
        });
      }))

    });
    // dialogRef.componentInstance.id = id
  }
  deleteImageFromArray(index) {
    this.ticketEdit.images.splice(index, 1);
    console.log(this.ticketEdit.images);
  }
  ticketToEdit(id: String) {
    let container: any;
    this.tickets.getSpecificTicket(id)
      .subscribe(res => {
        container = [res];
        container.map(x => {
          this.ticketEdit = x;
          this.model.title = this.ticketEdit.title;
          this.model.description = this.ticketEdit.description;
          this.model.ticket_date = this.ticketEdit.ticket_date;
          this.model.customer_id = this.ticketEdit.customer_id._id;
          this.model.company_locations = this.ticketEdit.company_locations;
          this.model.external = this.ticketEdit.external;
          this.model.priority = this.ticketEdit.priority;
          this.model.status = this.ticketEdit.status;
          this.model.category = this.ticketEdit.category;
          this.model.operator_id = this.ticketEdit.operator_id?._id;
          this.model.note = this.ticketEdit.note;
          this.model.images = this.ticketEdit.images;
          this.model.ticket_time = this.ticketEdit.ticket_time;
          this.model.ticket_reference_name = this.ticketEdit.ticket_reference_name;
          this.model.ticket_reference_number = this.ticketEdit.ticket_reference_number;
          this.model.ticket_reference_location = this.ticketEdit.ticket_reference_location;
        })
      })
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

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  searchTicket() {
    this.tickets.getTicketBySearch(this.searchData.value.titleSearch)
      .subscribe(res => {
        this.ticketsToDisplay = res;
      })
  }
  cancelSearch() {
    this.searchField = "";
    this.ticketsToDisplay = [];
    this.getAllTickets();
  }
  addTempsToSend() {
    let ticket_time = {
      0: this.startTemp,
      1: this.endTemp,
      2: this.collabWithTemp
    }

    this.ticket_times.push(ticket_time);
    this.ticket_times_stringify.push(JSON.stringify(ticket_time));
    console.log(this.ticket_times_stringify)
    console.log(this.ticket_times_stringify.length)
  }
  newTicket(newTicket) {

    console.log("ticket_time"+ newTicket.ticket_time)
    console.log("ticket_times_stringify length"+ this.ticket_times_stringify.length)
    console.log("ticket_times_stringify"+ this.ticket_times_stringify)
    newTicket.ticket_time = this.ticket_times_stringify

    console.log("TIME: " + newTicket.ticket_time);

    if(!this.newTicketData.value.operator_id){
      this.newTicketData.value.operator_id=null
    }


    const userlogged = localStorage.getItem('id');
    console.log(userlogged)
    this.newTicketData.value.added_by = userlogged;
    if (history.state.customerId != undefined) {
      this.newTicketData.value.customer_id = history.state.customerId;
    }
    const fd: any = new FormData();
    this.files.forEach((file) => {
      fd.append('images[]', file);
    });
    fd.append('title', this.newTicketData.value.title);
    fd.append('description', this.newTicketData.value.description);
    fd.append('ticket_date', this.newTicketData.value.ticket_date);
    fd.append('customer_id', this.newTicketData.value.customer_id);
    fd.append('external', this.newTicketData.value.external);
    fd.append('operator_id', this.newTicketData.value.operator_id);
    fd.append('priority', this.newTicketData.value.priority);
    fd.append('status', this.newTicketData.value.status);
    fd.append('note', this.newTicketData.value.note);
    fd.append('ticket_time', this.ticket_times_stringify);
    fd.append('category', this.newTicketData.value.category);
    fd.append('added_by', this.newTicketData.value.added_by);
    fd.append('ticket_reference_name', this.newTicketData.value.ticket_reference_name);
    fd.append('ticket_reference_number', this.newTicketData.value.ticket_reference_number);
    fd.append('ticket_reference_location', this.newTicketData.value.ticket_reference_location);
    fd.append('ticket_mode', this.newTicketData.value.ticket_mode);
    fd.append('customer_sign', this.newTicketData.value.customer_sign);

    this.tickets.createNewTickets(fd)
      .subscribe(res => {
        console.log(res);

      })

  }

  // => Get data OnInit
  getAllCustomer() {
    this.customer.getAllCustomers()
      .subscribe(res => {
        this.allCustomers = res;
      })
  }
  getAllTechs() {
    this.techs.getAlltechs()
      .subscribe(res => {
        this.allTechs = res;
      })
  }

  getStatuses() {
    this.status.getStatuses()
      .subscribe(res => {
        this.statuses = res;
      })
  }
  getCategories() {
    this.category.getCategories()
      .subscribe(res => {
        this.categories = res;
        console.log(this.categories);

      })
  }

  getIdAndCreateTicketByCustomer(id: String) {
    if (id != undefined) {
      this.customerIdModel = id;
      window.scrollTo(0, document.body.scrollHeight);
    }
  }




  // => ModalLogic
  open(content, id) {
    this.ticketToEdit(id);
    this.ticketIdToEdit=id
    this.modalService.open(content, { size: 'lg', centered: true, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  addTempToUpdate() {
    // this.ticketEdit.ticket_time.forEach(element => {
    //   this.model.ticket_time.push(element)
    // });
    let objTime = {
      0: this.start,
      1: this.end,
      2: this.collab
    }
    this.model.ticket_time.push(objTime);
    // this.model.ticket_time.push(JSON.stringify(objTime));
    console.log(this.model);
  }

  updateTicketReq() {
    // console.log(this.model.ticket_time)
    //this.model.ticket_time = JSON.stringify(this.model.ticket_time);
    this.modalService.dismissAll();
    // console.log(this.model)
    // console.log(this.ticketIdToEdit)
    this.ticketService.updateTicket(this.ticketIdToEdit, this.model).subscribe(res=>{
      // console.log(res)
      if(res){

        this.allTickets$ = this.getAllTickets()
      }
    })
    //  this.tickets.updateTicket(this.ticketEdit._id,this.model)
    //  .subscribe(res => {
    //    console.log(res);
    //  })

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

}


