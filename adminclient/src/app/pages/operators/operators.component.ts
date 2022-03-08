import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './../../interfaces/user';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit {

  allUsers$:Observable<User[]>;
  refresOperators$ = new BehaviorSubject<Boolean>(true);
  operatorsToDisplay:any



  newOperator = this.formBuilder.group({
    username:[""],
    password:[""],
    email:[""],
    status_holiday:[],
    user_type:["1"],
    insert_date:[Date.now()]
  });


  operatoToEdit:any = {
    username : String,
    password : String,
    email : String,
    user_type : Number,
    status_holiday : Boolean
  }

  operatorReqEdit:any;

  constructor(private users : UsersService, private formBuilder : FormBuilder) {
    this.operatorsToDisplay=[];
    this.operatoToEdit.username = "";
    this.operatoToEdit.password = "";
    this.operatoToEdit.email = "";
    this.operatoToEdit.user_type = 1;
    this.operatoToEdit.status_holiday = false;
   }

  ngOnInit(): void {
    this.allUsers$ = this.refresOperators$.pipe(switchMap(_ => this.getOperators()));
  }

  getOperators(){
    return this.users.getAllUsers()
    .pipe(
      map(users => users.filter(user => user.user_type !== 2))
    )
  }

  sendNewOperator(){
    this.users.createNewUser(this.newOperator.value)
    .subscribe(res => {
      this.allUsers$ = this.refresOperators$.pipe(switchMap(_ => this.getOperators()));
    });
}

  deleteOperator(id:String,index){
    this.users.deleteUser(id)
    .subscribe(res => {
      this.allUsers$ = this.refresOperators$.pipe(switchMap(_ => this.getOperators()));
    })
  }
  editOperator(id:String){
    this.users.getSpecificUser(id)
    .subscribe(res => {
      this.operatorReqEdit = res;
      this.operatoToEdit.username = this.operatorReqEdit.username;
      this.operatoToEdit.password = this.operatorReqEdit.password;
      this.operatoToEdit.email = this.operatorReqEdit.email;
      this.operatoToEdit.status_holiday = this.operatorReqEdit.status_holiday;
    })
  }
  sendNewOperatorData(){
    this.users.updateUser(this.operatorReqEdit._id,this.operatoToEdit)
    .subscribe(res => {
      this.allUsers$ = this.refresOperators$.pipe(switchMap(_ => this.getOperators()));
    })
  }
}
