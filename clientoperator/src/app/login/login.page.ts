import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';
import { StorageService } from '../services/storage.service';
import { TokenInterceptorService } from './../token-interceptor.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    public userData:any;
    getUsername(){
        return this.loginData.get('username');
    }
    getPassword(){
        return this.loginData.get('password');
    }

    public errorMessages = {
        username :[
            {type:'required', message:"Username Is Required"}
        ],
        password :[
            {type:'required', message:"Password Is Required"}
        ]
    }


    loginData = this.FormBuilder.group({
        email:['',[Validators.required]],
        password:['',[Validators.required]]
    })


    public login_res : any;
    constructor(private FormBuilder :FormBuilder, private router : Router, private auth : AuthService,private login : LoginService, private storage : StorageService, private alertController : AlertController) { }

    ngOnInit() {
        this.storage.getItem("userData");
    }




    sendLoginData(){
        this.auth.sendLoginReq(this.loginData.value).subscribe(res => {
            console.log(res);
            this.userData = res;
            localStorage.setItem('token', this.userData.token)
            localStorage.setItem('id', this.userData.userId)
            this.login.getUserDataStatus(this.userData.userId)
            .subscribe(res => {
                console.log(res)
                this.login_res = res;
                console.log(this.login_res.user_type);
                this.storage.setItem(this.login_res);
                if (this.login_res.user_type == 1) {
                    this.router.navigate(["/operatore-area"]);
                } else {
                    this.router.navigate(["/tecnico-area"]);
                }

            })

        },
        error => {
            this.presentAlert();
        }
    )
    }


    //Alert Function
    async presentAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attenzione',
            message: 'Una o più credenziali inserite sono errate',
            buttons: ['OK']
        });
        await alert.present();
    }
}
