import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { OperatorsComponent } from './pages/operators/operators.component';
import { TechsComponent } from './pages/techs/techs.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { CheckTokenService } from './services/check-token.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { TicketsService } from './services/tickets.service';
import { CustomersService } from './services/customers.service';
import { TechsService } from './services/techs.service';
import { UsersService } from './services/users.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusesService } from './services/statuses.service';
import { CategoriesService } from './services/categories.service';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';
import { ChartsService } from './services/charts.service';
import { DecimalPipe } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { StoreService } from './store/store.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TechDetailComponent } from './pages/tech-detail/tech-detail.component';

//Angular Material Components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {MatInputModule} from '@angular/material/input';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatRadioModule} from '@angular/material/radio';
// import {MatSelectModule} from '@angular/material/select';
// import {MatSliderModule} from '@angular/material/slider';
// import {MatSlideToggleModule} from '@angular/material/slide-toggle';
// import {MatMenuModule} from '@angular/material/menu';
// import {MatSidenavModule} from '@angular/material/sidenav';
// import {MatToolbarModule} from '@angular/material/toolbar';
// import {MatListModule} from '@angular/material/list';
// import {MatGridListModule} from '@angular/material/grid-list';
// import {MatCardModule} from '@angular/material/card';
// import {MatStepperModule} from '@angular/material/stepper';
// import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import {MatChipsModule} from '@angular/material/chips';
// import {MatIconModule} from '@angular/material/icon';
// import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import {MatProgressBarModule} from '@angular/material/progress-bar';
 import {MatDialogModule} from '@angular/material/dialog';
// import {MatTooltipModule} from '@angular/material/tooltip';
// import {MatSnackBarModule} from '@angular/material/snack-bar';
// import {MatTableModule} from '@angular/material/table';
// import {MatSortModule} from '@angular/material/sort';
 import {MatPaginatorModule} from '@angular/material/paginator';
import { CustomerDetailComponent } from './pages/customer-detail/customer-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidemenuComponent,
    TicketsComponent,
    OperatorsComponent,
    TechsComponent,
    CustomersComponent,
    LoginComponent,
    PageNotFoundComponent,
    TechDetailComponent,
    CustomerDetailComponent,


  ],
  imports: [

BrowserModule,
    AppRoutingModule,
    SharedComponentsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDropzoneModule,
    
    //material modules 
    BrowserAnimationsModule,
    // MatSnackBarModule,
    // MatInputModule,
    // MatAutocompleteModule,
    // MatDatepickerModule,
    // MatFormFieldModule,
    // MatRadioModule,
    // MatSelectModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatMenuModule,
    // MatSidenavModule,
    // MatToolbarModule,
    // MatListModule,
    // MatGridListModule,
    // MatCardModule,
    // MatStepperModule,
    // MatTabsModule,
    MatExpansionModule,
    // MatButtonToggleModule,
    // MatChipsModule,
    // MatIconModule,
    // MatProgressSpinnerModule,
    // MatProgressBarModule,
     MatDialogModule,
    // MatTooltipModule,
    // MatSnackBarModule,
    // MatTableModule,
    // MatSortModule,
     MatPaginatorModule


  ],
  providers: [DecimalPipe,TicketsService,CustomersService,TechsService,UsersService,StatusesService,CategoriesService,AuthService,CheckTokenService,StoreService,ChartsService,{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
