import { Component, Input,Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { CheckTokenService } from 'src/app/services/check-token.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  //Controller Show TabCustomers
  showTabCustomer:boolean = false;


  @Output() userTypeNav:any;

  constructor(private router : Router, private storage : StorageService) { }

  ngOnInit() {
    this.getUserType();
  }

  
  async getUserType(){
    const req = await this.storage.getItem('userData').then(res => {
        this.userTypeNav = JSON.parse(res);
    });
    if (this.userTypeNav.user_type == 1) {
      this.showTabCustomer = true;
    } else {
      this.showTabCustomer = false;
    }
  }
  goToHome(){
    if (this.userTypeNav.user_type == 2) {
      this.router.navigate(['/tecnico-area'])
    } else if(this.userTypeNav.user_type == 1) {
      this.router.navigate(["/operatore-area"]);
    }
}
  goToSearch(){
    this.router.navigate(["/search-ticket"]);
  }

  goToCustomerPage(){
    this.router.navigate(['/clienti']);
  }

}
