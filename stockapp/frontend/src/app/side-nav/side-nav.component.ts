import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  side_nav_flag: string
  public curUrl = ''
  constructor(private router: Router) {
    this.curUrl = this.router.url.split('/')[1]
    console.log(this.curUrl)
  }

  ngOnInit() {
    this.side_nav_flag = localStorage.getItem('side-nav-flag')
  }

}
