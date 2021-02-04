import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateCompanyComponent } from './../create-company/create-company.component';
import { RestService } from './../auth/rest.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.css']
})
export class ListCompanyComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['companyName', 'companyShortCode', 'action'];
  dataSource: MatTableDataSource<CompanyData>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  response: any;
  loader: boolean = false;

  constructor(private _snackBar: MatSnackBar, private restService: RestService, public dialog: MatDialog) {
    this.getCompanies()

  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  getCompanies() {
    this.loader = true;
    this.restService.authGetData('get-company-list')
      .subscribe(
        response => {
          this.response = response;
          if (this.response && this.response.success) {
            this.dataSource = new MatTableDataSource(this.response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          this.loader = false;
        },
        error => {
          this.openSnackBar(error.error.message, "")
          this.loader = false;
        });
  }

  deleteCompany(row) {
    if (confirm(`Are you sure you want to delete ${row.companyName}`)) {
      this.loader = true;
      this.restService.authDeleteData(`delete-company/${row.companyId}`)
        .subscribe(
          response => {
            if (response && response.success) {
              this.openSnackBar(response.message, "")
              this.getCompanies()
            }
          },
          error => {
            this.openSnackBar(error.error.message, "")
            console.log(error);
          });
    }
  }

  openCompanyDialog(row = null): void {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      width: '400px',
      data: row
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response && response.success) {
        this.getCompanies()
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}

export interface CompanyData {
  companyId: string;
  companyName: string;
  companyShortCode: string;
}
