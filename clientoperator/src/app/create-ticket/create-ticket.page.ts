import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from '../services/customers.service';
import { StorageService } from '../services/storage.service';
import { TechsService } from '../services/techs.service';
import { TicketsDataService } from '../services/tickets-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from './../services/categories.service';
import { StatusesService } from './../services/statuses.service';
import { HttpClient, HttpErrorResponse,HttpEventType } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Ticket } from '../interfaces/ticket';
@Component({
    selector: 'app-create-ticket',
    templateUrl: './create-ticket.page.html',
    styleUrls: ['./create-ticket.page.scss'],
})
export class CreateTicketPage implements OnInit {
    @ViewChild(IonContent, { static: false }) content: IonContent;


    imageFile:Array<File>;
    public imagePath;
    imgURL: any;
    public message: string;
    public file_array: Array<File>;



    progress:any;




    // =>
    collabTech:any;

    userData:any;
    allCustomers:any;
    alltechs:any;
    //Categories
    categoriesData:any;
    //Id From Customer
    idCustomer:any;
    techsRes:any;
    specificTech:any;
    //sedeCheck
    sedeCheck:Boolean = false;

    //CheckBlock
    customerToCheck:any;
    disableTech:Boolean;
    //Convert date
    date:any;

    ticket_times:any;
    ticket_times_stringify: any;
    allStatuses:any;
    // getTitleTicket(){
    //     return this.createNewTicket.get('title');
    // }
    // getInsertDataTicket(){
    //     return this.createNewTicket.get('insert_date');
    // }
    // getCustomerTicket(){
    //     return this.createNewTicket.get('customer_id');
    // }
    // getDescriptionTicket(){
    //     return this.createNewTicket.get('description');
    // }
    // getTecnicoTicket(){
    //     return this.createNewTicket.get('operator_id');
    // }
    // getDateTicket(){
    //     return this.createNewTicket.get('ticket_date');
    // }
    // getCategoryTicket(){
    //     return this.createNewTicket.get('category');
    // }
    // getStatusTicket(){
    //     return this.createNewTicket.get('priority');
    // }
    // getNoteTicket(){
    //     return this.createNewTicket.get('note');
    // }
    // getTicketMode(){
    //     return this.createNewTicket.get('ticket_mode');
    // }
    // getTicketReferenceName(){
    //     return this.createNewTicket.get('ticket_reference_name');
    // }
    // getTicketReferenceNumber(){
    //     return this.createNewTicket.get('ticket_reference_number');
    // }
    // getTicketReferenceLocation(){
    //     return this.createNewTicket.get('ticket_reference_location');
    // }


    createNewTicket= this.FormBuilder.group({
        title:["",[Validators.required]],
        customer_id:["",[Validators.required]],
        description:[""],
        operator_id:[null],
        ticket_date:[],
        category:["",[Validators.required]],
        priority:["",[Validators.required]],
        status:[""],
        added_by:[""],
        ticket_time:[],
        customer_sign:[""],
        images:[[]],
        note:[""],
        ticket_mode:[],
        ticket_reference_name:[""],
        ticket_reference_number:[""],
        ticket_reference_location:[""],
        external:this.sedeCheck
    })

    start:any;
    end:any;

    constructor(private FormBuilder:FormBuilder,
        private ticketService : TicketsDataService,
        private storage : StorageService,
        private customers : CustomersService,
        private techs : TechsService,
        private route : ActivatedRoute,
        private router : Router,
        private categories : CategoriesService,
        private status : StatusesService,
        private alert :AlertController,

        ) {
            this.imgURL = []
            this.file_array = [];
            this.ticket_times = [];
            this.ticket_times_stringify = [];
        }

        ngOnInit() {
            this.getOperatorId();
            this.getAllCustomers();
            this.getAllTechs();
            this.getCustomerid();
            this.getCategories();
            this.getStatuses();
        }


        async getOperatorId(){
            const req = this.storage.getItem('userData').then( res => {
                this.userData = JSON.parse(res);

            });
        }
        addTemps(){
            let ticket_time = {
                0:this.start,
                1:this.end,
                2:this.collabTech
            }
            this.ticket_times.push( ticket_time );
            this.ticket_times_stringify.push( JSON.stringify(ticket_time) );
            /*if (this.createNewTicket.value.ticket_time == null) {
                this.createNewTicket.value.ticket_time = []
                //this.createNewTicket.value.ticket_time = [...this.createNewTicket.value.ticket_time,ticket_time]
                this.createNewTicket.value.ticket_time.push( ticket_time );
                this.ticket_times = this.createNewTicket.value.ticket_time;
                console.log(this.ticket_times);

            } else if(this.createNewTicket.value.ticket_time.length >= 0) {
                //this.createNewTicket.value.ticket_time = [...this.createNewTicket.value.ticket_time,ticket_time]
                this.createNewTicket.value.ticket_time.push( ticket_time );
                this.ticket_times = this.createNewTicket.value.ticket_time;
                console.log(this.ticket_times);
            }
            console.log(this.createNewTicket.value.ticket_time);*/
        }
        removeTemp(index) {
            // this.createNewTicket.value.ticket_time.splice(index,1);
            // console.log(this.ticket_times)
            // console.log(this.ticket_times_stringify)
            this.ticket_times_stringify=[];
            this.ticket_times.splice(index,1)
            this.ticket_times.forEach(element => {
                this.ticket_times_stringify.push( JSON.stringify(element) );
            });
        }
        logScrollEnd (event)  {
            console.log(event);

        }
        sendCreateTicketData(){
            this.createNewTicket.value.external = this.sedeCheck;
            this.createNewTicket.value.added_by = this.userData._id;
            if (this.createNewTicket.value.operator_id == null) {
                this.createNewTicket.value.operator_id = null
                this.createNewTicket.value.status = "In attesa di tecnico"
            } else {
                this.createNewTicket.value.status = this.createNewTicket.value.status;
            }
            if (this.createNewTicket.value.customer_id == "" && this.specificTech[0]?._id) {
                this.createNewTicket.value.customer_id = this.specificTech[0]?._id;
            }
            const fd:any = new FormData();
            this.file_array.forEach((file) => {
                fd.append('images[]', file);
            });
            fd.append('title',this.createNewTicket.value.title);
            fd.append('customer_id',this.createNewTicket.value.customer_id);
            fd.append('description',this.createNewTicket.value.description);
            fd.append('operator_id',this.createNewTicket.value.operator_id);
            fd.append('ticket_date',this.createNewTicket.value.ticket_date);
            fd.append('category',this.createNewTicket.value.category);
            fd.append('priority',this.createNewTicket.value.priority);
            fd.append('status',this.createNewTicket.value.status);
            fd.append('added_by',this.createNewTicket.value.added_by);
            fd.append('ticket_time', this.ticket_times_stringify );
            fd.append('customer_sign',this.createNewTicket.value.customer_sign);
            fd.append('note',this.createNewTicket.value.note);
            fd.append('ticket_mode',this.createNewTicket.value.ticket_mode);
            fd.append('ticket_reference_name',this.createNewTicket.value.ticket_reference_name);
            fd.append('ticket_reference_number',this.createNewTicket.value.ticket_reference_number);
            fd.append('ticket_reference_location',this.createNewTicket.value.ticket_reference_location);
            fd.append('external',this.sedeCheck);
            this.ticketService.sendNewTicketReq(fd)
            .subscribe(res => {
                // console.log(event);
                const newTicket  : Ticket = res;
                // if (event.type === HttpEventType.UploadProgress && !Error) {
                //         this.content.scrollToTop();
                //         this.progress = Math.round(event.loaded / event.total  * 100);
                //         setTimeout(() => {
                //             this.router.navigate(["/operatore-area"])
                //             this.progress = 0;
                //         },1000)
                // }
                // if(event.type === HttpEventType.Response && !Error){
                //     console.log(HttpEventType.Response);
                // }
                // else if (Error){
                //     throw(Error);
                // }
                this.presentAlertAfterCreationTicket(newTicket.ticket_number, this.gotToOperatorAreaWithParameter());
                console.log(res);
                
            },
            (error) => {
                if (error) {
                    console.log(error);

                    this.presentAlert("Operazione Fallita !", "Creazione Ticket non Andata a Buon Fine")
                }
            }
            )
        }

        getAllCustomers(){
            this.customers.getAllCustomers().subscribe(res => {
                this.allCustomers = res;
            });
        }
        getAllTechs(){
            this.techs.getAllTechs().subscribe(res => {
                this.alltechs = res;
            })
        }


        getCustomerid() {
            let container=[];
            this.idCustomer =this.route.snapshot.paramMap.get('id');
            this.customers.getAllCustomers().subscribe(res => {
                this.techsRes = res;
                this.techsRes.map(x => {
                    if (x._id == this.idCustomer ) {
                        container.push(x)
                    }
                })
            })
            this.specificTech = container;
        }

        async getCategories(){
            await this.categories.getAllCategories()
            .subscribe( res => {
                this.categoriesData = res;
            })
        }
        convertDate(dateOfToday){
            let a = new Date(dateOfToday);
            let year = a.getFullYear();
            let month = a.getMonth() +1;
            let date = a.getDate();
            let hour = a.getHours();
            let min = a.getMinutes();
            let sec = a.getSeconds();
            let time = date + '/' + month + '/' + year;
            this.date = time;
            return time;

        }

        changeCheck(){
            this.sedeCheck = !this.sedeCheck;
        }
        checkCustomerDisabled(id){
            this.customers.getCustomer(id)
            .subscribe(res => {
                this.customerToCheck = res;
                if (this.customerToCheck.customer_disabled == true) {
                    this.disableTech = true;
                } else {
                    this.disableTech = false;
                }
            })
        }
        getStatuses(){
            this.status.getStatuses()
            .subscribe(res => {
                this.allStatuses = res;
            })
        }

        imagesPreview(event) {
            this.imageFile = event.target.files;
            for (let i=0; i< event.target.files.length; i++) {
                this.file_array.push( event.target.files[i] );
                let mimeType = event.target.files[i].type;
                if (mimeType.match(/image\/*/) == null) {
                    this.message = "Only images are supported.";
                    return;
                }
                let reader = new FileReader();
                this.imagePath = event.target.files[i];
                reader.readAsDataURL(event.target.files[i]);
                reader.onload = (_event) => {
                    this.imgURL.push(reader.result);
                }
            }
        }
        removeImageToArray(index){
            this.file_array.splice(index,1);
            this.imgURL.splice(index,1);
        }


        async presentAlert(header,message) {
            const alert = await this.alert.create({
                cssClass: 'my-custom-class',
                header: header,
                message: message,
                buttons: ['OK']
            });
            await alert.present();
        }
        async presentAlertAfterCreationTicket(number, cb) {
            const alert = await this.alert.create({
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
                  ]
                });
            await alert.present();
        }

        gotToOperatorAreaWithParameter(){
            this.router.navigate(["/operatore-area",{newTicket : true}])
        }
    }
