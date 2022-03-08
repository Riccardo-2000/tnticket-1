import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CheckTokenService } from './services/check-token.service';
import { StoreService } from './store/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements OnInit {
  title = 'tntdashboard';

  show:Boolean;


  constructor(private router : Router,private token : CheckTokenService,private store : StoreService){}

  ngOnInit(){
    // this.store.init();
  this.router.events.subscribe((e) => {
    if(e instanceof NavigationEnd ){
        console.log(e.url);
        if (e.url == "/login" || e.url == "/" ) {
          this.show=false;
        } else {
          this.show=true;
        }
    }
  });





  }
}
