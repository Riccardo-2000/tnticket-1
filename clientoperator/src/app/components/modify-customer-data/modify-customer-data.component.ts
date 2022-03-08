import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder,Form,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-modify-customer-data',
  templateUrl: './modify-customer-data.component.html',
  styleUrls: ['./modify-customer-data.component.scss'],
})
export class ModifyCustomerDataComponent implements OnInit {

  @Input() id: string;
  contract_hours:Number;
  block:Boolean = false;
  newNumber:string;
  newAddress:string;
  getCompanyName(){
    return this.modifyCustomerData.get('company_name');
  }
  getCompanyReference(){
    return this.modifyCustomerData.get('company_reference');
  }
  getCompanyNumber(){
    return this.modifyCustomerData.get('company_number');
  }
  getCompanyLocations(){
    return this.modifyCustomerData.get('company_locations');
  }
  getInsertDate(){
    return this.modifyCustomerData.get('contract_hours');
  }

  dataCustomerToDisplay:any = {}
  modifyCustomerData = this.FormBuilder.group({
    company_name:[this.dataCustomerToDisplay.company_name,[Validators.required]],
    company_reference:["",[Validators.required]],
    company_number:[[this.dataCustomerToDisplay.company_number]],
    company_locations:[[]],
    insert_date:[Date.now()],
    contract_hours:[]
  })






  constructor
  (private modalCrtl : ModalController,
    private FormBuilder : FormBuilder,
    private customer : CustomersService,
    public alertController: AlertController,
    private router : Router)
    {this.newNumber = ""
    this.newAddress = ""

  }

  ngOnInit() {
    this.getCustomerData();
    this.contract_hours =this.dataCustomerToDisplay.contract_hours;
  }

  dismissModal(data) {
    this.modalCrtl.dismiss({
      'dismissed': true,
      data:data
    });
  }


  getCustomerData(){
    const req = this.customer.getCustomer(this.id).subscribe(res => {
      this.dataCustomerToDisplay = res;
        if (this.dataCustomerToDisplay.customer_disabled == false) {
            this.block = false;
        } else {
            this.block = true;
        }

    })
  }

  sendModifyCustomerData(){
    if (this.newNumber != "") {
      this.dataCustomerToDisplay.company_number.push(this.newNumber);
    }
    if (this.newAddress != "") {
      this.dataCustomerToDisplay.company_locations.push(this.newAddress);
    }
    this.modifyCustomerData.value.company_number = this.dataCustomerToDisplay.company_number;
    this.modifyCustomerData.value.company_locations = this.dataCustomerToDisplay.company_locations;
    this.modifyCustomerData.value.contract_hours = this.contract_hours;
    //Post
    this.customer.updateCustomer(this.id,this.modifyCustomerData.value)
    .subscribe(res => {
      console.log(res);

    })
  }

  deleteCustomer(){
    this.customer.deleteCustomers(this.id)
    .subscribe(res => {
        console.log(res);
        this.router.navigate(["/clienti"]);
    })
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attenzione !',
      message: 'Sei Sicuro di voler eliminare questo cliente ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteCustomer();
            this.dismissModal(id);
          }
        }
      ]
    });
    await alert.present();
  }
  async presentAlertModify() {
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
            this.sendModifyCustomerData();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteNumber(i) {
    this.dataCustomerToDisplay.company_number.splice(i,1);
    let divToDelete = document.getElementById('input-'+i);
    divToDelete.remove();
  }
  deleteLocation(t) {
    this.dataCustomerToDisplay.company_locations.splice(t,1);
    let divToDelete = document.getElementById('inputAddress-'+t);
    divToDelete.remove();
  }


  sendBlockOrRemove(){
    this.block = !this.block;
    let blockToSend = {
        customer_disabled:this.block
    }
    this.customer.sendBlockOrRemove(this.id,blockToSend)
    .subscribe(res => {
        console.log(res);
    })
  }
  async alertSendBlock(){
    if (this.block == false) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione',
            message: 'Sei Sicuro di voler bloccare il cliente ?',
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
                  this.sendBlockOrRemove();
                }
              }
            ]
          });

          await alert.present();
    } else {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione',
            message: 'Sei Sicuro di voler sbloccare il cliente ?',
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
                  this.sendBlockOrRemove();
                }
              }
            ]
          });

          await alert.present();
    }
  }

}
