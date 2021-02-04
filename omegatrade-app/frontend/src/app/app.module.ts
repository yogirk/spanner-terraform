import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'angular-highcharts';
import { LoginComponent } from './login/login.component';
import { ValidationService } from './common/validation.service';
import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { RegisterComponent } from './register/register.component';
import { StockDashboardComponent } from './stock-dashboard/stock-dashboard.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './common/material-module'
import { AuthGuardService } from './auth/auth-guard.service';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { SimulateStockDataComponent } from './simulate-stock-data/simulate-stock-data.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ControlMessagesComponent,
    RegisterComponent,
    StockDashboardComponent,
    SideNavComponent,
    CreateCompanyComponent,
    EditCompanyComponent,
    ListCompanyComponent,
    HeaderComponent,
    SimulateStockDataComponent,
  ],
  entryComponents: [
    CreateCompanyComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    HttpClientModule,
    SocialLoginModule
  ],
  exports: [ControlMessagesComponent],
  providers: [ValidationService, AuthGuardService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '427907482591-qgi5lvlh5ntt8t7uqn2ctb3blq7j3sgr.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
