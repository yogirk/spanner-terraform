import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from './../auth/rest.service';

@Component({
  selector: 'app-simulate-stock-data',
  templateUrl: './simulate-stock-data.component.html',
  styleUrls: ['./simulate-stock-data.component.css']
})
export class SimulateStockDataComponent implements OnInit {
  displayedColumns: string[] = ['companyName', 'companyShortCode', 'status', 'action'];
  dataSource: MatTableDataSource<SimuationData>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  response: any;
  companies: any;
  simulateForm: any;
  time = [5, 10, 15, 30, 60];
  datas = [100, 200, 400, 600];
  loader: boolean = false;
  simulations: any;
  constructor(private _snackBar: MatSnackBar, private restService: RestService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.getCompanies();
    this.simulateForm = this.formBuilder.group({
      companyId: ['', [Validators.required]],
      timeInterval: ['', [Validators.required]],
      data: ['', [Validators.required]],
    });
    this.getSimulations();
  }

  getCompanies() {
    this.restService.authGetData('get-company-list')
      .subscribe(
        response => {
          this.response = response
          if (this.response && this.response.success) {
            this.companies = this.response.data;
          }
        },
        error => {
          console.log(error);
        });
  }

  deleteSimulation(row) {
    this.restService.authDeleteData(`delete-simulation/${row.sId}`)
      .subscribe(
        response => {
          if (response && response.success) {
            this.openSnackBar(response.message, "")
            this.getSimulations();
          }
          this.loader = false;
        }, error => {
          console.log(error)
        }
      );
  }

  simulate() {
    this.loader = true;
    this.restService.authPostData('simulate-company-data', this.simulateForm.value)
      .subscribe(
        response => {
          console.log(response)
          if (response && response.success) {
            this.getSimulations();
          }
          this.loader = false;
        },
        error => {
          console.log(error)
          this.loader = false;

        });
  }

  getSimulations() {
    this.loader = true;
    this.restService.authPostData('get-simulations', {})
      .subscribe(
        response => {
          if (response && response.success) {
            this.simulations = response.data;
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          this.loader = false;
        },
        error => {
          console.log(error)
          this.loader = false;

        });
  }

  updateSimulation(params) {
    this.loader = true;
    let payLoad = { sId: params.sId, status: (params.status) ? false : true }
    this.restService.authPutData('update-simulation', payLoad)
      .subscribe(
        response => {
          if (response && response.success) {
            this.getSimulations();
            this.openSnackBar(response.message, "")
          }
          this.loader = false;
        },
        error => {
          console.log(error)
          this.loader = false;

        });

  }

  isAlreadyStarted(id: string) {
    if (this.simulations && this.simulations.find(el => el.companyId === id)) {
      return true;
    }
    return false;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

export interface SimuationData {
  sID: string;
  companyName: string;
  companyShortCode: string;
  status: boolean;
}
