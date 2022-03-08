import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonFooter, ModalController } from '@ionic/angular';
import { ModalTicketByCustomerComponent } from '../components/modal-ticket-by-customer/modal-ticket-by-customer.component';
import { ModifyCustomerDataComponent } from '../components/modify-customer-data/modify-customer-data.component';
import { CustomersService } from '../services/customers.service';
import { LoadingService } from '../services/loading.service';
import { ModalAddCustomerComponent } from './../components/modal-add-customer/modal-add-customer.component';

import { Customer } from './../interfaces/customer';
import { Observable,fromEvent ,concat, from} from 'rxjs';
import { map,tap,switchMap,debounceTime,distinctUntilChanged, concatMap} from 'rxjs/operators';
import { ImageCustomerSliderComponent } from './../components/image-customer-slider/image-customer-slider.component';
import { IonContent} from '@ionic/angular';
import { element } from 'protractor';
@Component({
    selector: 'app-clienti',
    templateUrl: './clienti.page.html',
    styleUrls: ['./clienti.page.scss'],
})
export class ClientiPage implements OnInit {
    @ViewChild('searchInput') input:ElementRef;
    @ViewChild(IonFooter, { static: false }) footer:ElementRef;
    @ViewChild(IonContent, { static: false }) content: IonContent;
    allCustomers$:Observable<Customer[]>;
    customerToUpdate$:Observable<Customer[]>;
    searchLoaded:boolean=false

    constructor(private modalCrtl : ModalController, private customer : CustomersService, private route : ActivatedRoute,public loading : LoadingService) {

    }

    ngOnInit() {
        this.allCustomers$ = this.initialCustomers()
        

    }



    ngAfterViewInit(){
        const searchCustomer$ =  fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
            map(event => event.target.value),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(search =>this.loadCustomers(search))
            )
            const initialCustomers$ = this.initialCustomers();
            this.allCustomers$ = concat(initialCustomers$,searchCustomer$);
            console.log(this.footer);
        }
        loadCustomers(search = ''):Observable<Customer[]>{
            this.searchLoaded=true
            if (search != '') {
                return this.customer.getCustomerByName(search).pipe(tap(res=>{if(res){this.searchLoaded=false}}));
            }
            return this.initialCustomers().pipe(tap(res=>{if(res){this.searchLoaded=false}}));
        }
        initialCustomers(){
            return this.customer.getAllCustomers().pipe(tap(clienti=>{
                clienti.forEach(cliente => {
                });
            }),map(clienti=>clienti.sort((a, b) => (b.tickets.length - a.tickets.length))))
        }
        async presentModal() {
            const modal = await this.modalCrtl.create({
                component: ModalAddCustomerComponent,
                cssClass: 'my-custom-modal-css'
            });
            modal.onDidDismiss().then(data => {
                console.log(data)
                const obsData$:Observable<Customer[]> = from([data.data.data])
                console.log(obsData$.subscribe(res => {console.log(res)
                }));
                this.allCustomers$ = concat(this.allCustomers$,obsData$)
            })
            return await modal.present();
        }
        async presentModalEdit(id) {
            const modal = await this.modalCrtl.create({
                component: ModifyCustomerDataComponent,
                cssClass: 'my-custom-modal-css',
                componentProps: {
                    'id': id,
                }
            });
            modal.onDidDismiss().then(data => {
                console.log(data.data.data)
                this.allCustomers$ = this.allCustomers$
                .pipe(
                    map(customers => customers.filter(customer => customer._id != data.data.data))
                    )
                })
                return await modal.present();
            }
            async presentModalTicketByCustomer(id) {
                const modal = await this.modalCrtl.create({
                    component: ModalTicketByCustomerComponent,
                    cssClass: 'my-custom-modal-css',
                    componentProps: {
                        'id': id,
                    }
                });
                return await modal.present();
            }

            async openImagesSlider(imagesProp,id){
                const modal = await this.modalCrtl.create({
                    component: ImageCustomerSliderComponent,
                    cssClass: 'ticketSliderModal',
                    componentProps: {
                        id:id,
                        images:imagesProp
                    }
                });
                modal.onDidDismiss().then(data => {
                    if (data.data) {
                        const idCustomer = data.data.id;
                        const indexImageToDelete = data.data.imageIndex;
                        this.customer.getCustomer(idCustomer)
                        .subscribe( res => {
                            let customerToUpdate:any = res;
                            customerToUpdate.images.splice(indexImageToDelete,1);
                            console.log(customerToUpdate)
                            this.customer.updateCustomer(idCustomer,customerToUpdate).subscribe(
                                res =>{
                                    console.log(res)
                                    this.ngOnInit();
                                }
                            )
                            })
                        } else {
                            return;
                        }
                    })
                    return await modal.present();
                }




            }

