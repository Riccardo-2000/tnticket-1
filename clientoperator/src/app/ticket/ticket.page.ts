import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { TicketsDataService } from './../services/tickets-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalCloneTicketComponent } from '../components/modal-clone-ticket/modal-clone-ticket.component';
import { ModifyTicketDataComponent } from '../components/modify-ticket-data/modify-ticket-data.component';
import { StorageService } from '../services/storage.service';
import { CheckTokenService } from '../services/check-token.service';
import { CustomersService } from '../services/customers.service';
import { TechsService } from '../services/techs.service';
import { StatusesService } from '../services/statuses.service';
import { LoginService } from '../services/login.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { Location } from '@angular/common'
import { ImageCustomerSliderComponent } from './../components/image-customer-slider/image-customer-slider.component';
import { Ticket } from './../interfaces/ticket';
import { exit } from 'process';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
// import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.page.html',
    styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

    // => 
    showSign = false;


    //=> Collab Temp Tech
    collabTech: any;
    //SedeCheck
    sedeCheck: Boolean = false;

    // => Sign
    signature: string;

    userType;

    // New Records
    recordHour;
    recordDate;
    ticketTimeObject;

    //DataIntervento
    dataIntervento: any;
    //ModificaNote
    modifyNote: String;
    //Controller Staus Assegnato o da Assegnare
    ticketAssigned = false;
    //Controller Modifca Bottone
    showModifyButton: Boolean = false;
    //ControllerShowAddRecords&Modify
    showAddRecordModifyButton: Boolean = false;
    //ShowStatusSelect
    showStatus: Boolean = true;
    //ShowDelegaButton
    showDelegaButton: Boolean = true;
    // New Status Value
    newStatusValue: any;
    //CompanyName
    companyName: any;

    techCheck: Boolean = null;

    //=> Reference location
    referenceLocation: String;
    //Delega
    techReceiveDelega: any
    allTechs: any
    allTechsToShow: any
    getStatusValue() {
        return this.statusValue.get('status');
    }
    statusValue = this.formBuilder.group({
        status: [''],
    })
    //Form Tempistica
    tempisticaRecords = this.formBuilder.group({

    })
    //Id Dinamico
    public id: any;
    public ticket: any;

    //UserType
    user: any;
    //ShowModifyButton
    modifyButton: Boolean = false;
    //Get All Statuses
    statusesData: any;
    //UserId
    UserId: any;
    //OperatorData
    operatorData: any;
    //InsertedBy
    added_by: any;
    constructor(private formBuilder: FormBuilder,
        private ticketData: TicketsDataService,
        private router: Router,
        private route: ActivatedRoute,
        private modalCrtl: ModalController,
        private storage: StorageService,
        private check: CheckTokenService,
        private customers: CustomersService,
        private techs: TechsService,
        public alertController: AlertController,
        private status: StatusesService,
        private login: LoginService,
        private callNumber: CallNumber,
        private location: Location,
         private pdfGenerator: PDFGenerator
    ) {
        this.recordHour = ""
        this.recordDate = ""
        this.allTechsToShow = []
    }

    ngOnInit() {
        this.getTicket();
        this.getUserType();
        this.getStatuses();
        this.getTechs();

    }

    

    async presentModalEditTicket(id) {
        const modal = await this.modalCrtl.create({
            component: ModifyTicketDataComponent,
            cssClass: 'my-custom-modal-css',
            componentProps: {
                'id': id,
            }
        });
        return await modal.present();
    }

    async takeTicket() {
        this.ticketAssigned = true;
        await this.storage.getItem('userData').then(res => {
            this.UserId = JSON.parse(res);
            let operator_id = {
                operator_id: this.UserId._id,
                status: "In lavorazione"
            }
            this.ticket.status = "In lavorazione";
            this.ticketData.ticketUpdate(this.id, operator_id).subscribe(res => {
                console.log(res);
            })
        });

    }

    //Submit Status Value Form
    sendStatusValue() {

        console.log("res");
        this.ticketData.ticketUpdate(this.id, this.statusValue.value).subscribe(res => {
            console.log(res);
            console.log(this.id);
        })
    }


    getTicket() {
        this.id = this.route.snapshot.paramMap.get('id');

        this.ticketData.getTicket(this.id)
            .subscribe(res => {
                this.ticket = res;
                if (this.ticket.operator_id == null) {
                    this.ticketAssigned = false;
                } else {
                    this.ticketAssigned = true;
                }
                if (this.ticket.status == "In attesa di tecnico") {
                    this.ticket.operator_id = null;
                }
                if (this.ticket.operator_id == null) {
                    let operatorData = {
                        username: "Tecnico Non Assegnato"
                    };
                    this.operatorData = operatorData;
                }
                if (this.ticket.ticket_date) {
                    this.ticket.ticket_date = this.ticket.ticket_date.slice(0, 10);
                    this.ticket.ticket_date = this.ticket.ticket_date.slice(0, 10)
                    let input = this.ticket.ticket_date;
                    let output = input.replace(/(\d{4})-(\d\d)-(\d\d)/, "$3-$2-$1");
                    this.ticket.ticket_date = output;
                    console.log(this.ticket.ticket_date);

                }
                if (this.ticket.customer_sign) {
                    this.showSign = false;
                } else {
                    this.showSign = true;
                }
                this.sedeCheck = this.ticket.external;
                console.log(this.sedeCheck);


            }, (error) => {
                if (error) {
                    this.ErrorRedirect();
                }
            }
            );
    }


    async getUserType() {
        const req = await this.storage.getItem('userData').then(res => {
            this.storage.getItem("userData").then(res => {
                this.userType = JSON.parse(res),
                    this.DelegaButton(this.userType)
                if (this.userType.user_type == 1) {
                    this.showAddRecordModifyButton = false;
                    this.showModifyButton = true;
                    this.showStatus = true;
                } else {
                    this.showAddRecordModifyButton = true;
                    this.showModifyButton = false;
                    this.showStatus = false;
                    this.techCheck = true;
                }
            });

        })
    }

    addRecord() {
        if (this.recordHour == "" || this.recordDate == "") {
            this.presentAlertEmptyRecord();
        } else {
            let start_split = this.recordHour.split("T");
            let end_split = this.recordDate.split("T");
            let start_date = start_split[0].split("-");
            let start_time = start_split[1].split(":");
            let end_date = end_split[0].split("-");
            let end_time = end_split[1].split(":");
            let start_datetime = new Date(Date.UTC(start_date[0], start_date[1], start_date[2], start_time[0], start_time[1]));
            let start_timestamp = start_datetime.getTime() / 1000;
            let end_datetime = new Date(Date.UTC(end_date[0], end_date[1], end_date[2], end_time[0], end_time[1]));
            let end_timestamp = end_datetime.getTime() / 1000;
            //console.log( start_timestamp, end_timestamp );
            if (start_timestamp > end_timestamp) {
                this.presentAlertEmptyRecord();
            }
            else {
                this.ticket.ticket_time.push([this.recordHour, this.recordDate, this.collabTech]);
                let ticketTimeObject = {
                    ticket_time: this.ticket.ticket_time
                }
                console.log(ticketTimeObject)

                this.ticketData.ticketUpdate(this.id, ticketTimeObject).subscribe(res => {
                    this.ticketTimeObject = ticketTimeObject;
                })
                this.recordHour = "";
                this.recordDate = "";
            }
        }

    }
    removeTemp(index) {
        console.log(index);
        this.ticket.ticket_time.splice(index, 1);
        let ticketTimeObject = {
            ticket_time: this.ticket.ticket_time
        }
        this.ticketData.ticketUpdate(this.id, ticketTimeObject).subscribe(res => {
            console.log(res);
            this.ticketTimeObject = ticketTimeObject;
        })
    }
    async deleteTicket() {
        await this.ticketData.ticketDelete(this.id).subscribe(res => {
            console.log(res);
            if (res) {
                this.router.navigate(["/operatore-area", { id: this.id }]);
            }
        }, (error) => {
            this.presentAlertDeleteError("Errore", "Eliminazione Ticket Non Andata A Buon Fine")
            console.log(error);
        }
        )

    }

    ticketDataModify() {
        let ticketDataLavorazione = {
            ticket_date: this.dataIntervento
        }
        this.ticketData.ticketUpdate(this.id, ticketDataLavorazione).subscribe(res => {
            console.log(res);

        })
    }
    ticketNoteModify() {
        let ticketNoteLavorazione = {
            note: this.modifyNote
        }
        this.ticketData.ticketUpdate(this.id, ticketNoteLavorazione).subscribe(res => {
            console.log(res);

        })
    }
    async presentAlertDeleteError(header, message) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: header,
            message: message,
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
    async presentAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione',
            message: 'Sei Sicuro di voler eliminare il ticket ?',
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
                        this.deleteTicket();
                    }
                }
            ]
        });

        await alert.present();
    }
    async presentAlertEmptyRecord() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione',
            message: 'Uno o piu campi tempisitca sono vuoti , si prega di inserire tutti i campi',
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
                    }
                }
            ]
        });

        await alert.present();
    }
    async confirmStatustAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Fatto !',
            message: 'Modifica Status avvenuta con successo',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {

                    }
                }
            ]
        });

        await alert.present();
    }
    async confirmtakeTicket() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Fatto !',
            message: 'Presa In carico ticket avvenuta con successo',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        this.takeTicket();
                    }
                }
            ]
        });

        await alert.present();
    }

    async sendNewDate() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione !',
            message: 'Sei Sicuro di voler aggiungere questa data ?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.ticketDataModify();
                    }
                }
            ]
        });

        await alert.present();
    }


    async sendNewNote() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione !',
            message: 'Sei sicuro di voler aggiungere queste note ?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.ticketNoteModify();
                    }
                },
            ]
        });

        await alert.present();
    }

    getStatuses() {
        const req = this.status.getStatuses()
            .subscribe(res => {
                this.statusesData = res;


            });
    }

    changeCheck(value,id) {
        this.sedeCheck = !this.sedeCheck;
        let externalValue = {
            external: this.sedeCheck,
        }
        if(!this.sedeCheck){
            let referenceToModify = {
                ticket_reference_location: ''
            }
            this.ticketData.ticketUpdate(id, referenceToModify)
                .subscribe(res => {
    
                })
        }
        this.ticketData.ticketUpdate(this.id, externalValue)
            .subscribe(res => {
                // console.log(res);
            })
        // if (value === true) {
        //     this.sedeCheck = false
        // }
        // this.sedeCheck = true;
        // console.log(this.sedeCheck);
        // console.log(value);
        // console.log(value);
        // console.log(this.sedeCheck);
        // if (this.sedeCheck === true) {
        //     this.sedeCheck = false;
        // } else {
        //     this.sedeCheck = true;
        // }
        // console.log(externalValue);

    }

    getTechs() {
        this.techs.getAllTechs()
            .subscribe(res => {
                this.allTechs = res;
                this.allTechs.map(x => {
                    if (x._id == this.userType._id) {
                        return;
                    } else {
                        this.allTechsToShow.push(x);
                    }
                })
            })
    }
    async sendDelegaReq() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione !',
            message: 'Sei sicuro di voler delegare questo ticket ?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.sendDelega();
                    }
                },
            ]
        });
        await alert.present();
    }

    sendDelega() {
        let sendedDelega = {
            techSend: this.userType._id,
            techReceive: this.techReceiveDelega
        }
        this.ticketData.sendDelega(this.id, sendedDelega)
            .subscribe(res => {
                console.log(res);
            })
        // this.router.navigate(["/tecnico-area"]);
    }

    DelegaButton(userType) {
        if (userType.userType == 2 && userType.tickets.includes(this.id)) {
            console.log("TicketAssegnato")
        } else {
            console.log("Non Assegnato")
        }
    }
    async presentAlertSollecita() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione !',
            message: 'Sei sicuro di voler sollecitare questo ticket ?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.remind()
                    }
                },
            ]
        });
        await alert.present();
    }
    remind() {
        let reminder = {
            operator: this.userType.username,
            date: new Date(Date.now()).toISOString()
        }
        this.ticket.reminder.push(reminder)
        this.ticketData.sendReminder(this.id, reminder)
            .subscribe(res => {
                console.log(res);
            })


    }
    async sendCall() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione !',
            message: 'Sei sicuro di voler chiamare il cliente ?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        if (this.ticket.customer_id.company_number.length > 0) {
                            this.callNumber.callNumber(this.ticket.ticket_reference_number, true)
                                .then(res => console.log('Launched dialer!', res))
                                .catch(err => console.log('Error launching dialer', err));
                        }
                    }
                },
            ]
        });
        await alert.present();
    }

    sendReferenceLocation(id: String) {
        let referenceToModify = {
            ticket_reference_location: this.referenceLocation
        }
        this.ticketData.ticketUpdate(id, referenceToModify)
            .subscribe(res => {
                if(res){
                    this.confirmLocation()
                }

            })
    }
    async ErrorRedirect() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione !',
            message: 'I dati non sono stati caricati correttamente ',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        this.location.back()
                    }
                },
            ]
        });
        await alert.present();
    }
    async confirmLocation() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Inserimento Località !',
            message: 'Località inserita correttamente ',
            buttons: [
                {
                    text: 'Ok'
                },
            ]
        });
        await alert.present();
    }
    async ErrorLoadSign() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione !',
            message: 'La Firma Non è stata caricata correttamente ',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        return;
                    }
                },
            ]
        });
        await alert.present();
    }

    async confirmSendSignCustomer() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione !',
            message: 'Sei Sicuro di voler inviare la firma ? \n Lo status del ticket passerà automaticamente a "Risolto"',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        if (this.userType.user_type == 2) {
                            this.router.navigate(['/tecnico-area'])
                          } else if(this.userType.user_type == 1) {
                            this.router.navigate(["/operatore-area"]);
                          }
                        return this.loadSign();
                    }
                },
                {
                    text: 'Cancel',
                    handler: () => {
                        return;
                    }
                },
            ]
        });
        await alert.present();
    }


    async openImagesSlider(imagesProp) {
        const modal = await this.modalCrtl.create({
            component: ImageCustomerSliderComponent,
            cssClass: 'ticketSliderModal',
            componentProps: {
                images: imagesProp
            }

        });
        modal.onDidDismiss().then(data => {
            if (data.data) {
                this.ticketData.getTicket(this.id)
                    .subscribe(res => {
                        let ticket: any = res;
                        ticket.images.splice(data.data.imageIndex, 1);
                        this.ticket.images.splice(data.data.imageIndex, 1);
                        this.ticketData.ticketImageUpdate(this.id, ticket)
                            .subscribe(res => {
                                console.log(res)
                            })

                    })
            } else {
                return;
            }
        })
        return await modal.present();
    }

    getSign(value): string {

        return this.signature = value;

    }

    loadSign() {

        const ticketId = this.route.snapshot.paramMap.get('id');

        const payload: Partial<Ticket> = {

            customer_sign: this.signature,

        }

        return this.ticketData.loadSign(ticketId, payload)
            .subscribe(
                res => this.getTicket(),
                error => this.ErrorLoadSign()
            )
    }

    // @ViewChild('htmlData') htmlData: ElementRef;

//    downloadPDF(): void {
//      var content= document.getElementById('htmlData').innerHTML;
//      let options = {
//        documentSize: 'A4',
//        type: 'share',
//        // landscape: 'portrait',
//        fileName: 'Order-Invoice.pdf'
//      };
//      this.pdfGenerator.fromData(content, options)
//        .then((base64) => {
//          console.log('OK', base64);
//        }).catch((error) => {
//          console.log('error', error);
//        });
//    }
    
}
