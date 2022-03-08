import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { url } from '../../../src/environments/environment';
import { BehaviorSubject, noop, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../shared/interfaces/User";
import { Router } from "@angular/router";
import { Ticket } from '../shared/interfaces/Ticket';

const AuthLocalStorage = 'TNC_User';
const Token = 'TNC_Token';


@Injectable({
  providedIn : 'root'
})
export class AuthStore {

  //TODO : Implementare Logica Token


  private subject = new BehaviorSubject<User>(null);
  user$:Observable<User> = this.subject.asObservable();

  constructor(private http : HttpClient , private router : Router){


    const user = JSON.parse(localStorage.getItem(AuthLocalStorage));

    if (user) {

      this.subject.next(user);

    }

  }

  reload( old = false ) : Observable<Ticket[]>{

    const user = JSON.parse(localStorage.getItem(AuthLocalStorage));

    return this.http.get<Ticket[]>(url +'customerarea/reload/'+user._id+'/'+old)

  }


  login( payload : any) : Observable<User> {

    return this.http.post<User>(url + 'customerarea/login' ,payload)
    .pipe(
      tap((user) => {

        localStorage.setItem(AuthLocalStorage , JSON.stringify(user));
        localStorage.setItem(Token, JSON.stringify(user.token))
        this.subject.next(user);
        this.router.navigate(['/home'])

      })
    )

  }


  modifyAccessData(customerId : string , payload) : Observable<User>{
    return this.http.post<User>(url + 'dash/customer/credentials/' + customerId, payload)
    .pipe(
      tap((user) => {

        user.tickets = user.tickets.slice(0,1);
        localStorage.setItem(AuthLocalStorage , JSON.stringify(user));
        localStorage.setItem(Token, JSON.stringify(user.token))
        this.subject.next(user);

      })
    )
  }


  logout() {

    this.router.navigate(['/']);

    this.subject.next(null);

    localStorage.clear()

    return

  }






}
