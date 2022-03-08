import { Component, OnInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CustomersService } from 'src/app/services/customers.service';
import { Customer } from './../../interfaces/customer';
import { HttpClient, HttpErrorResponse,HttpEventType } from '@angular/common/http';
@Component({
    selector: 'app-modal-add-customer',
    templateUrl: './modal-add-customer.component.html',
    styleUrls: ['./modal-add-customer.component.scss'],
})
export class ModalAddCustomerComponent implements OnInit {
    imageFile:Array<File>;
    public imagePath;
    imgURL: any;
    public message: string;
    public file_array: Array<File>;
    showOk:boolean = true;


    progress:any;

    getCompanyName(){
        return this.newCustomerData.get('company_name');
    }
    getCompanyReference(){
        return this.newCustomerData.get('company_reference');
    }
    getCompanyNumber(){
        return this.newCustomerData.get('company_number');
    }
    getCompanyLocations(){
        return this.newCustomerData.get('company_locations');
    }
    getInsertDate(){
        return this.newCustomerData.get('insert_date');
    }
    getCategory(){
        return this.newCustomerData.get('category');
    }



    newCustomerData = this.FormBuilder.group({
        company_name:"",
        company_reference:"",
        company_number:[[]],
        company_locations:[[]],
        category:0,
        contract_hours:[],
        // contract_start : [""],
        images:[]
    })

    formNumbers={
        company_number : []
    };


    contract:Boolean = false


    inputGenerator:number = 0;


    numbers:any;
    inputNumberValue:String;

    addresses:any
    inputAddressValue:String;

    constructor
    (private modalCrtl : ModalController,
        private FormBuilder : FormBuilder,
        private customer : CustomersService,
        private alert :AlertController,
        private router : Router) {
            this.numbers = []
            this.addresses = []
            this.imgURL = []
            this.file_array = [];
        }

        ngOnInit() {}
        dismissModal(data) {
            this.modalCrtl.dismiss({
                'dismissed': true,
                data:data
            });
        }



        sendNewCustomer(){
            this.newCustomerData.value.company_number = this.numbers;
            this.newCustomerData.value.company_locations = this.addresses;
            this.customer.sendNewCustomerData(this.newCustomerData.value)
            .subscribe(res =>
                {
                    if (res) {
                        this.presentAlert("OK !", "Creazione Cliente Andata a Buon Fine")
                        this.router.navigate(["/clienti"]);
                    }
                },(error) => {
                    if (error) {
                        this.presentAlert("Operazione Fallita !", "Creazione Cliente non Andata a Buon Fine")
                        this.router.navigate(["/clienti"]);
                    }
                }
                )
        }

            navigateToHome(){
                this.router.navigate(["operatore-area", {newCustomer : true}]);
                this.modalCrtl.dismiss()
            }

            addInputFieldsNumbers(){
                let number = this.inputNumberValue;
                this.numbers.push(number);
            }
            addInputFieldsAddress(){
                let address = this.inputAddressValue;
                this.addresses.push(address);
            }
            contractToggle() {
                this.contract = !this.contract;
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
            addCustomerWithImage(){
                this.newCustomerData.value.company_number = this.numbers;
                this.newCustomerData.value.company_locations = this.addresses;
                const fd:any = new FormData();
                this.file_array.forEach((file) => {
                  fd.append('images[]', file);
                });
                //fd.append('images',this.file_array);
                fd.append('company_name',this.newCustomerData.value.company_name);
                fd.append('company_reference',this.newCustomerData.value.company_reference);
                fd.append('company_number',this.newCustomerData.value.company_number);
                fd.append('company_locations',this.newCustomerData.value.company_locations);
                fd.append('category',this.newCustomerData.value.category);
                if (this.contract === true ) {
                    fd.append('contract_hours',this.newCustomerData.value.contract_hours);
                    // fd.append('contract_start',this.newCustomerData.value.contract_start);
                } else {
                    fd.append('contract_hours',this.newCustomerData.value.contract_hours = 0);
                    // fd.append('contract_start', new Date().toLocaleDateString());
                }
                this.customer.sendNewCustomerData(fd)
                .subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(event.loaded / event.total  * 100);
                    } else if(event.type === HttpEventType.Response){
                        if(this.progress == 100){
                            setTimeout(() => {
                                this.dismissModal(event.body);
                            },1500)
                        }
                        this.router.navigate(["/clienti"]);
                    }
                },(error) => {
                    if (error) {
                        this.presentAlert("Operazione Fallita !", "Creazione Cliente non Andata a Buon Fine")
                        this.modalCrtl.dismiss();
                    }
                }
                )
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
        }

