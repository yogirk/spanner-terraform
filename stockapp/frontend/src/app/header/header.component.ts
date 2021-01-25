import { Component, OnInit,AfterViewInit } from '@angular/core';
import { RestService } from './../auth/rest.service';
import { TokenStorageService } from './../auth/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {
  user:any;
  constructor(private restService:RestService,private router: Router,private tokenService :TokenStorageService ) { }
  
  ngOnInit(): void {
    this.user = this.tokenService.getUser();
  }

  ngAfterViewInit() {
  
  }

  logOut(){
    this.restService.logOut();
    this.router.navigateByUrl('')
  }

  

}
