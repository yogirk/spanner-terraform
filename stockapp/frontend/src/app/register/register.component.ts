import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from './../common/validation.service';
import { RestService } from './../auth/rest.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { TokenStorageService } from '../auth/token-storage.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm: any;
  loader: boolean = false;
  user: any;
  constructor(private tokenStorage: TokenStorageService,private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private restService: RestService, private router: Router, private authService: SocialAuthService) {
    this.signUpForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      businessEmail: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      provider: [''],
      photoUrl: ['']
    });
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
    });
  }

  signUpWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.loader = true;
      this.signUpForm.setValue({
        'businessEmail': user.email,
        'fullName': user.name,
        'password': '',
        'confirmPassword': '',
        'photoUrl': user.photoUrl,
        'provider': user.provider
      });
      this.loader = false;
      this.signUpForm.get('password').touched = true;
      this.signUpForm.get('confirmPassword').touched = true;
      this.openSnackBar("provide password to complete your registration!", "")
    });
  }

  signUp() {
    if (this.signUpForm.dirty && this.signUpForm.valid) {
      if (this.signUpForm.value.password == this.signUpForm.value.confirmPassword) {
        this.loader = true;
        this.restService.postData('register-user', this.signUpForm.value)
          .subscribe(
            response => {
              if (response && response.success) {
                this.tokenSuccessHandler(response)
              }
              this.loader = false;
              this.loader = false;
            },
            error => {
              this.openSnackBar(error.error.message, "")
              this.loader = false;
            });
      }
    }
  }

  tokenSuccessHandler(response) {
    this.tokenStorage.saveToken(response.authToken);
    this.tokenStorage.saveUser(response.userInfo);
    this.router.navigateByUrl('/dashboard');
    this.openSnackBar(response.message, "")
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


}
