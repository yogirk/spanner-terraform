import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StockDashboardComponent } from './stock-dashboard/stock-dashboard.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { SimulateStockDataComponent } from './simulate-stock-data/simulate-stock-data.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'sign-up',component:RegisterComponent},
  {path:'dashboard',component:StockDashboardComponent, canActivate: [AuthGuardService]},
  {path:'company-list',component:ListCompanyComponent, canActivate: [AuthGuardService]},
  {path:'simulate',component:SimulateStockDataComponent, canActivate: [AuthGuardService]},
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
