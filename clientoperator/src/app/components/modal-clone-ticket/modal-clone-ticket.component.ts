import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Ticket } from 'src/app/interfaces/ticket';
import { CategoriesService } from 'src/app/services/categories.service';
import { LoginService } from 'src/app/services/login.service';
import { StatusesService } from 'src/app/services/statuses.service';
import { StorageService } from 'src/app/services/storage.service';
import { TechsService } from 'src/app/services/techs.service';
import { TicketsDataService } from 'src/app/services/tickets-data.service';

@Component({
  selector: 'app-modal-clone-ticket',
  templateUrl: './modal-clone-ticket.component.html',
  styleUrls: ['./modal-clone-ticket.component.scss'],
})

export class ModalCloneTicketComponent implements OnInit {

  @Input() id: string;

  public file_array: Array<File>


  getTitle() {
    return this.cloneTicketData.get('title');
  }
  getDescription() {
    return this.cloneTicketData.get('description');
  }
  geTticketDate() {
    return this.cloneTicketData.get('ticket_date');
  }
  getOperatorId() {
    return this.cloneTicketData.get('operator_id');
  }
  getInsertDate() {
    return this.cloneTicketData.get('insert_date');
  }
  getCategory() {
    return this.cloneTicketData.get('category');
  }
  getPriority() {
    return this.cloneTicketData.get('priority');
  }
  getStatus() {
    return this.cloneTicketData.get('status');
  }

  cloneTicketData = this.FormBuilder.group({
    title: ["", [Validators.required]],
    customer_id: ["", [Validators.required]],
    description: [""],
    operator_id: [null],
    ticket_date: [],
    category: ["", [Validators.required]],
    priority: ["", [Validators.required]],
    status: [""],
    added_by: [""],
    ticket_time: [],
    customer_sign: [""],
    images: [[]],
    note: [""],
    ticket_mode: [],
    ticket_reference_name: [""],
    ticket_reference_number: [""],
    ticket_reference_location: [""],
    external: false
  })

  //GetTicketData
  ticketData: any;
  //GetUserType
  userType: any;
  //Get All Techs
  allTechs: any;
  //Get Categories Data
  categoriesData: any;
  //Get All Statuses
  statusesData: any;

  //OperatorUsername
  operatorUsername: any;
  constructor(private modalCrtl: ModalController,
    private FormBuilder: FormBuilder,
    private tickets: TicketsDataService,
    private router: Router,
    private techs: TechsService,
    private categories: CategoriesService,
    private status: StatusesService,
    private alertController: AlertController,
    private login: LoginService) { }

  ngOnInit() {
    this.file_array = [];
    this.getTicket();
    this.getAllTechs();
    this.getCategories();
    this.getStatuses();
  }


  dismissModal() {
    this.modalCrtl.dismiss({
      'dismissed': true
    });
  }


  sendModifyTicketData() {
    console.log(this.cloneTicketData.value);

  }
  changeCheck(id) {
    let sedeCheckToSend: any;
    if (this.ticketData.external === true) {
      sedeCheckToSend = false
    } else {
      sedeCheckToSend = true
    }
    let external = {
      external: sedeCheckToSend
    }
    this.tickets.ticketUpdate(id, external)
      .subscribe(res => {
        console.log(res);
      })
  }
  async getTicket() {
    const req = await this.tickets.getTicket(this.id).subscribe(res => {
      this.ticketData = res;
      console.log(this.ticketData)
      console.log(this.ticketData.customer_id)

      if (this.ticketData.operator_id != null) {
        this.login.getUserDataStatus(this.ticketData.operator_id._id)
          .subscribe(res => {
            this.operatorUsername = res;
          });
      }
      this.cloneTicketData.setValue({
        title: this.ticketData.title,
        customer_id: this.ticketData.customer_id,
        description: this.ticketData.description,
        operator_id: this.ticketData.operator_id,
        ticket_date: this.ticketData.ticket_date,
        category: this.ticketData.category,
        priority: this.ticketData.priority,
        status: this.ticketData.status,
        added_by: this.ticketData.added_by._id,
        ticket_time: this.ticketData.ticket_time,
        customer_sign: this.ticketData.customer_sign,
        images: this.ticketData.images,
        note: this.ticketData.note,
        ticket_mode: this.ticketData.ticket_mode,
        ticket_reference_name: this.ticketData.ticket_reference_name,
        ticket_reference_number: this.ticketData.ticket_reference_number,
        ticket_reference_location: this.ticketData.ticket_reference_location,
        external: this.ticketData.external
      })

      return;
    })
  }

  duplicateTicket() {
    var ticketTimes=[]
    var ticketTimeStringify=[]
    this.cloneTicketData.value.customer_id = this.cloneTicketData.value.customer_id._id
    this.cloneTicketData.value.ticket_time.forEach(singletime=>{
      var newTime={0: singletime[0], 1:singletime[1], 2:singletime[2]}
      ticketTimeStringify.push(JSON.stringify(newTime))
    })
    console.log(this.cloneTicketData.value)
    console.log((ticketTimeStringify))
    
     const fd: any = new FormData();
     this.file_array.forEach((file) => {
       fd.append('images[]', file);
     });
     fd.append('title', this.cloneTicketData.value.title);
     fd.append('customer_id', this.cloneTicketData.value.customer_id);
     fd.append('description', this.cloneTicketData.value.description);
     fd.append('operator_id', this.cloneTicketData.value.operator_id);
     fd.append('ticket_date', this.cloneTicketData.value.ticket_date);
     fd.append('category', this.cloneTicketData.value.category);
     fd.append('priority', this.cloneTicketData.value.priority);
     fd.append('status', this.cloneTicketData.value.status);
     fd.append('added_by', this.cloneTicketData.value.added_by);
     fd.append('ticket_time', ticketTimeStringify);
     fd.append('customer_sign', this.cloneTicketData.value.customer_sign);
     fd.append('note', this.cloneTicketData.value.note);
     fd.append('ticket_mode', this.cloneTicketData.value.ticket_mode);
     fd.append('ticket_reference_name', this.cloneTicketData.value.ticket_reference_name);
     fd.append('ticket_reference_number', this.cloneTicketData.value.ticket_reference_number);
     fd.append('ticket_reference_location', this.cloneTicketData.value.ticket_reference_location);
     fd.append('external', this.cloneTicketData.value.external);
     this.tickets.sendNewTicketReq(fd)
       .subscribe(res => {
         // console.log(event);
         const newTicket: Ticket = res;
         this.presentAlertAfterCreationTicket(newTicket.ticket_number, this.router.navigate(["/tecnico-area"]));
    //     console.log(res);

       },
         (error) => {
           if (error) {
             console.log(error);

             this.errorCreateAlert("Operazione Fallita !", "Creazione Ticket non Andata a Buon Fine")
           }
         }
       )
  }
  async getAllTechs() {
    const req = await this.techs.getAllTechs().subscribe(res => {
      this.allTechs = res;


    })
  }
  getCategories() {
    this.categories.getAllCategories()
      .subscribe(res => {
        this.categoriesData = res;
      })
  }
  getStatuses() {
    const req = this.status.getStatuses()
      .subscribe(res => {
        this.statusesData = res;
      })
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attenzione',
      message: 'Sei Sicuro di voler duplicare il ticket ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.duplicateTicket();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertError() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attenzione',
      message: "Duplicazione ticket fallita , controlla di aver inserito tutti i campi. " +
        " I seguenti Campi sono Obbligatori :" +
        " Data Lavorazione" +
        "Categoria",
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            return;
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertAfterCreationTicket(number, cb) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Operazione Riuscita',
      message: `Ticket N° #${number} creato con successo`,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            return cb;
          }
        }
      ],
      
    });
    await alert.present();
    this.modalCrtl.dismiss();
  }

  async errorCreateAlert(header, message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }


}
