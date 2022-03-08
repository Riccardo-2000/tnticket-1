import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpEventType } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { Customer } from './../interfaces/customer';
import { report } from 'process';
import { url } from './../../environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {
    newCustomer:any;
    id:any;
    url:String;
    constructor(private HttpClient : HttpClient) {
        this.url =url;
    }
    sendNewCustomerData(newCustomer){
        return this.HttpClient.post(this.url+'customers',newCustomer,{ reportProgress:true , observe :'events',responseType:'json'})
    }
    getAllCustomers():Observable<Customer[]> {
        return this.HttpClient.get<Customer[]>(this.url+'customers')
        .pipe(
            map(x =>  x.sort( (a,b) => {

                let aOne = a.company_name.toLocaleLowerCase(),
                    bOne = b.company_name.toLocaleLowerCase()

                    if (aOne < bOne) {
                        return -1;
                    }
                    if (aOne > bOne) {
                        return 1;
                    }
                    return 0;

            }))
        )
    }
    getCustomer(id:String){
        return this.HttpClient.get(this.url+'customer/'+id);
    }
    deleteCustomers(id:String) {
        return this.HttpClient.delete(this.url+'customer/'+id);
    }
    getTicketsByCustomer(id:String) {
        return this.HttpClient.get(this.url +'tickets/customer/'+id);
    }
    getCustomerByName(term):Observable<Customer[]>{
        return this.HttpClient.get<Customer[]>(this.url+'customers/search/'+term);
    }
    updateCustomer(id:String, newDataCustomer){
        return this.HttpClient.post(this.url+'customer/'+id,newDataCustomer);
    }
    sendBlockOrRemove(id:String, payload) {
        return this.HttpClient.post(this.url+'customers/block/'+id,payload);
    }
}
