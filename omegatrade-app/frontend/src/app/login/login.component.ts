import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from './../common/validation.service';
import { RestService } from './../auth/rest.service';
import { TokenStorageService } from '../auth/token-storage.service'
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loader: boolean = false;
  user: any;

  constructor(private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private authService: SocialAuthService, private restService: RestService, private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      businessEmail: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required]]
    });

    console.log(this.loginForm.authToken);
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.loader = true;
      this.restService.postData('get-token-social', user)
        .subscribe(
          response => {
            if (response && response.success) {
              this.tokenSuccessHandler(response)
            }
            this.loader = false;
          },
          error => {
            this.openSnackBar(error.error.message, "")
            this.loader = false;
            if (error.error && error.error.redirect == 'sign-up') {
              this.router.navigateByUrl('/sign-up');
            }
          });
    });
  }

  signOut(): void {
    this.authService.signOut();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  login() {
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.loader = true;
      this.restService.postData('login', this.loginForm.value)
        .subscribe(
          response => {
            if (response && response.success) {
              this.tokenSuccessHandler(response)

            }
            this.loader = false;
          },
          error => {
            this.openSnackBar(error.error.message, "")
            this.loader = false;
          });
    }
  }

  tokenSuccessHandler(response) {
    this.tokenStorage.saveToken(response.authToken);
    this.tokenStorage.saveUser(response.userInfo);
    this.router.navigateByUrl('/dashboard');
    this.openSnackBar(response.message, "")
  }

}

