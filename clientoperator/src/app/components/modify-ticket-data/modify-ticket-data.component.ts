import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CategoriesService } from 'src/app/services/categories.service';
import { LoginService } from 'src/app/services/login.service';
import { StatusesService } from 'src/app/services/statuses.service';
import { StorageService } from 'src/app/services/storage.service';
import { TechsService } from 'src/app/services/techs.service';
import { TicketsDataService } from 'src/app/services/tickets-data.service';

@Component({
    selector: 'app-modify-ticket-data',
    templateUrl: './modify-ticket-data.component.html',
    styleUrls: ['./modify-ticket-data.component.scss'],
})
export class ModifyTicketDataComponent implements OnInit {

    @Input() id: string;


    getTitle(){
        return this.modifyTicketData.get('title');
    }
    getDescription(){
        return this.modifyTicketData.get('description');
    }
    geTticketDate(){
        return this.modifyTicketData.get('ticket_date');
    }
    getOperatorId(){
        return this.modifyTicketData.get('operator_id');
    }
    getInsertDate(){
        return this.modifyTicketData.get('insert_date');
    }
    getCategory(){
        return this.modifyTicketData.get('category');
    }
    getPriority(){
        return this.modifyTicketData.get('priority');
    }
    getStatus(){
        return this.modifyTicketData.get('status');
    }

    modifyTicketData = this.FormBuilder.group({
        title:["",[Validators.required]],
        description:["",[Validators.required]],
        ticket_date:[],
        operator_id:[],
        category:[""],
        priority:[""],
        status:[""],
        ticket_reference_name:[""],
        ticket_reference_number:[""],
        ticket_reference_location:[""],
    })

    //GetTicketData
    ticketData:any;
    //GetUserType
    userType:any;
    //Get All Techs
    allTechs:any;
    //Get Categories Data
    categoriesData:any;
    //Get All Statuses
    statusesData:any;

    //OperatorUsername
    operatorUsername:any;
    constructor(private modalCrtl : ModalController,
        private FormBuilder : FormBuilder,
        private tickets : TicketsDataService,
        private router : Router,
        private techs : TechsService,
        private categories : CategoriesService,
        private status : StatusesService,
        private alertController : AlertController,
        private login : LoginService) { }

        ngOnInit() {
            this.getTicket();
            this. getAllTechs();
            this.getCategories();
            this.getStatuses();
        }


        dismissModal() {
            this.modalCrtl.dismiss({
                'dismissed': true
            });
        }


        sendModifyTicketData(){
            console.log(this.modifyTicketData.value);

        }
        changeCheck(id){
            let sedeCheckToSend:any;
            if (this.ticketData.external === true) {
                sedeCheckToSend = false
            } else {
                sedeCheckToSend = true
            }
            let external = {
                external:sedeCheckToSend
            }
            this.tickets.ticketUpdate(id,external)
            .subscribe(res => {
                console.log(res);
            })
        }
        async getTicket(){
            const req = await this.tickets.getTicket(this.id).subscribe(res => {
                this.ticketData = res;
                console.log(this.ticketData)

                if (this.ticketData.operator_id != null) {
                    this.login.getUserDataStatus(this.ticketData.operator_id._id)
                    .subscribe(res => {
                        this.operatorUsername = res;
                    });
                }
                this.modifyTicketData.setValue({
                    title: this.ticketData.title,
                    description:this.ticketData.description,
                    ticket_date:this.ticketData.ticket_date,
                    operator_id:this.ticketData.operator_id,
                    category:this.ticketData.category,
                    priority:this.ticketData.priority,
                    status:this.ticketData.status,
                    ticket_reference_name:this.ticketData.ticket_reference_name,
                    ticket_reference_number:this.ticketData.ticket_reference_number,
                    ticket_reference_location:this.ticketData.ticket_reference_location,
                })

                return;
            })
        }

        updateTicket(){
            if (this.modifyTicketData.value.operator_id == "") {
                this.modifyTicketData.value.operator_id = null;
            }
            const req = this.tickets.ticketUpdate(this.id,this.modifyTicketData.value)
            .subscribe(res => {
                console.log(res);
                this.modalCrtl.dismiss();
            },(error)=> {
                this.presentAlertError();
            });
            this.router.navigate(['/operatore-area',{newTicket : true}]);
            console.log(this.modifyTicketData.value)
        }
        async getAllTechs(){
            const req = await this.techs.getAllTechs().subscribe(res => {
                this.allTechs = res;
                

            })
        }
        getCategories(){
            this.categories.getAllCategories()
            .subscribe( res => {
                this.categoriesData = res;
            })
        }
        getStatuses(){
            const req = this.status.getStatuses()
            .subscribe(res => {
                this.statusesData = res;
            })
        }


        async presentAlert() {
            const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Attenzione',
                message: 'Sei Sicuro di voler modificare il ticket ?',
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
                            this.updateTicket();
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
                message: "Modifica ticket fallita , controlla di aver inserito tutti i campi. " +
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

    }
