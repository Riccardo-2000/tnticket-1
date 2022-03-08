import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthStore } from 'src/app/store/auth.store';
import { User } from '../../shared/interfaces/User';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss'],
  animations : [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)', transition:0.5 }),
        animate('200ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ]
})
export class CustomerDataComponent implements OnInit {


  modifyAccessData = this.formBuilder.group({


    //username : ['' , Validators.required],
    password : ['' , Validators.required],


  })


  constructor(private formBuilder : FormBuilder, private store  : AuthStore) { }

  ngOnInit(): void {
  }

  editAccessData(){

    const { _id : ID } = JSON.parse(localStorage.getItem('TNC_User'));

    console.log(ID);

    return this.store.modifyAccessData(ID , this.modifyAccessData.value).subscribe(console.log)


  }

}
