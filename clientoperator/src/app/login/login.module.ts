import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginPage } from './login.page';
import { LoginService } from '../services/login.service';


@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoginPage],
  providers:[LoginService]
})
export class LoginPageModule {}
