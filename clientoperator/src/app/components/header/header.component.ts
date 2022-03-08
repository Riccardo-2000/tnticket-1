import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    avatarImage:String;

    backButtonController=true;
    // Date Now
    date:any;

    userData:any;
    constructor(private router : Router, public NavController : NavController, private storage : StorageService,private auth : AuthService) { }

    ngOnInit() {
        this.backButtonShow();
        this.getUserData();
        this.convertDate();
    }



    async getUserData(){
        const req = await this.storage.getItem('userData').then(res=> {
            this.userData = JSON.parse(res);
        })
    }


    navigateToOperatoreArea(){
        this.router.navigate(['/operatore-area']);
    }
    back(){
        this.NavController.back();
    }




    backButtonShow (){
        if (this.router.url == "/tecnico-area" || this.router.url == "/operatore-area") {
            this.backButtonController = false;
        } else {
            this.backButtonController = true;
        }
    }

    logOut(){
        this.auth.logOut();
    }



    convertDate(){
        let a = new Date(Date.now());
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

    goToUserDataPage(){
        this.router.navigate(['/modify-user-profile']);
    }

}
