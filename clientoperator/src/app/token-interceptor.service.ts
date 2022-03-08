import { Injectable } from '@angular/core';

import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';


@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
    token:string;
    constructor(private storage : StorageService) { }

    intercept(req:HttpRequest<any>,next:HttpHandler)
    {
        this.token = localStorage.getItem('token');
        req = this.addToken(req, this.token);
        return next.handle(req);
    }

    private addToken(req:HttpRequest<any>,token:string)
    {
        return req.clone({
            setHeaders:{'Authorization':`Bearer ${token}` }
        });
    }

}
