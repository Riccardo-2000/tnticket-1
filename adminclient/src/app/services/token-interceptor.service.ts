import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor {


  constructor() { }

  intercept(req:HttpRequest<any>,next:HttpHandler)
  {
    let token = localStorage.getItem('token');
    req = this.addToken(req, token);
    return next.handle(req);
  }

  private addToken(req:HttpRequest<any>,token:string)
  {
     return req.clone({
       setHeaders:{'Authorization':`Bearer ${token}` }
     });
  }
}
