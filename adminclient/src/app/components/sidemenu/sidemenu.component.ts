import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  constructor(private router : Router, private auth : AuthService) { }

  ngOnInit(): void {
    this.sideAnimation();
  }

  sideAnimation(){
    let header = document.getElementById("myHeader");
    console.log(header);
    function myFunction(x) {
      let sticky = header.offsetTop;
      if (x.matches) { // If media query matches
        header.classList.add("stickyPos");
      } else {
        header.classList.remove("stickyPos");
      }
    }
    let x = window.matchMedia("(max-width: 800px)")
    myFunction(x)
    x.addEventListener('onResize',(myFunction));
  }

  logOut(){
    this.auth.logOut();
    this.router.navigate(["/login"]);
  }

}
