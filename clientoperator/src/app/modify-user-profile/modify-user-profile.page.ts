import { Component, OnInit} from '@angular/core';
import { FormBuilder,ReactiveFormsModule,Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { StorageService } from '../services/storage.service';

@Component({
    selector: 'app-modify-user-profile',
    templateUrl: './modify-user-profile.page.html',
    styleUrls: ['./modify-user-profile.page.scss'],
})
export class ModifyUserProfilePage implements OnInit {

    userData:any;
    controllerChecked:Boolean=false;

    userDataStatus:any;
    getNewUsername(){
        return this.sendNewDatProfile.get('username');
    }
    getNewPassword(){
        return this.sendNewDatProfile.get('password');
    }
    getConfirmNewPassword(){
        return this.sendNewDatProfile.get('confirmNewPassword');
    }

    sendNewDatProfile = this.FormBuilder.group({
        username:["",[Validators.required]],
        password:["",[Validators.required]],
        confirmNewPassword:["",[Validators.required]],
    })



    constructor(
        private storage : StorageService,
        private FormBuilder : FormBuilder,
        private login:LoginService,
        private alertController : AlertController) { }

        ngOnInit() {
            this.getUserData();
        }


        async getUserData(){
            const req = await this.storage.getItem('userData').then(res=> {
                this.userData = JSON.parse(res);
                this.controllerChecked = this.userData.status_holiday
            })
        }
        changeCheck(){
            this.controllerChecked = !this.controllerChecked;
            let statusHoliday = {
                status_holiday: this.controllerChecked
            }
            this.userData.status_holiday = this.controllerChecked;
            this.storage.setItem(this.userData);
            this.login.sendHolidayUserStatus(this.userData._id,statusHoliday)
            .subscribe(res => {
                console.log(res);

            })
        }


        async presentAlert() {
            const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Attenzione',
                message: 'Le due password non coincidono',
                buttons: ['OK']
            });

            await alert.present();
        }

        async presentAlertMSG( msg ) {
            const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Attenzione',
                message: msg,
                buttons: ['OK']
            });

            await alert.present();
        }


        sendFormValue(){
            if (this.sendNewDatProfile.value.password == this.sendNewDatProfile.value.confirmNewPassword ) {
                //Post Request Here
                let newData = {
                    password : this.sendNewDatProfile.value.password,
                    username : this.sendNewDatProfile.value.username
                }
                this.login.updateUserData(this.userData._id,newData)
                .subscribe(res => {
                    console.log(res);
                    this.presentAlertMSG( "Dati aggiornati correttamente." );
                });
            } else {
                this.presentAlert();
            }
        }
    }


