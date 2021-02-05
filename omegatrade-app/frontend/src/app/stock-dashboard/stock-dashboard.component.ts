import { Component, OnInit } from '@angular/core';
import { Chart, StockChart } from 'angular-highcharts';
import { RestService } from './../auth/rest.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subscription } from "rxjs";

@Component({
  selector: 'app-stock-dashboard',
  templateUrl: './stock-dashboard.component.html',
  styleUrls: ['./stock-dashboard.component.css']
})
export class StockDashboardComponent implements OnInit {
  curCompany: string = "";
  stock: StockChart;
  stocks: any;
  company: any;
  companies: any;
  response: any;
  loader: boolean = false;
  subscription: Subscription;
  intervalId: number;

  constructor(private _snackBar: MatSnackBar, private restService: RestService) {
  }

  ngOnInit(): void {
    this.getCompanies()
  }

  getStockData() {
    this.loader = true;
    this.restService.authPostData('dashboard', { "companyId": this.curCompany })
      .subscribe(
        response => {
          if (response && response.success) {
            this.stocks = response.data.stocks;
            this.company = response.data.company;
            this.parseStockDatas();
            this.loader = false;
          }
        },
        error => {
          this.openSnackBar(error.error.message, "")
          this.loader = false;
        });
  }

  parseStockDatas() {
    let data = [];
    for (var i = 0; i < this.stocks.length; i++) {
      data.push([this.stocks[i].date, this.stocks[i].currentValue])
    }
    this.init(data)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  changeCompany() {
    this.getStockData()
  }

  getCompanies() {
    this.restService.authGetData('get-company-list')
      .subscribe(
        response => {
          this.response = response
          if (this.response && this.response.success) {
            this.companies = this.response.data;
            if (this.curCompany == "") {
              let index = this.companies.findIndex(x => {
                if (x.companyName.toLowerCase().trim() === "google corp" || x.companyName.toLowerCase().trim() === "google")
                  return x;
              });
              if (index > 0) {
                this.curCompany = this.companies[index].companyId;
              } else {
                this.curCompany = this.companies[0].companyId;
              }
              this.getStockData();
            }
          }
        },
        error => {
          this.openSnackBar(error.error.message, "")
          this.loader = false;
        });
  }

  init(data) {
    this.stock = new StockChart({
      rangeSelector: {
        selected: 1
      },
      title: {
        text: this.company.companyName + ' Stock Price'
      },
      series: [{
        tooltip: {
          valueDecimals: 2,
        },
        name: this.company.companyShortCode,
        type: 'line',
        data: data,
      }]
    });

    this.updatePoints();

  }

  updatePoints() {
    const source = interval(5000);
    this.subscription = source.subscribe(val => this.updateDashboard());
  }

  updateDashboard() {
    if (this.stocks && this.stocks.length > 0) {
      this.restService.authPostData('dashboard', { "companyId": this.curCompany, "date": this.stocks[(this.stocks.length - 1)].date })
        .subscribe(
          response => {
            if (response && response.success) {
              let data = response.data.stocks
              console.log(this.stocks)
              if (data.length === 0)
                this.subscription.unsubscribe();
              this.stock.ref$.subscribe(chart => {
                for (var i = 0; i < data.length; i++) {
                  chart.series[0].addPoint([data[i].date, data[i].currentValue]);
                }
              });
            }
          },
          error => {
            this.openSnackBar(error.error.message, "")
            this.loader = false;
          });
    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
