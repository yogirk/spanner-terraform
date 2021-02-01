import { Component, OnInit,Inject, Injectable } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from  '@angular/material/dialog';
import { ValidationService } from './../common/validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from './../auth/rest.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit {
  createCompanyForm: any;
  loader:boolean = false;
  constructor(private _snackBar: MatSnackBar,private restService:RestService,private formBuilder: FormBuilder,private  dialogRef:  MatDialogRef<CreateCompanyComponent>, @Inject(MAT_DIALOG_DATA) public  data:  any) {
    this.createCompanyForm = this.formBuilder.group({
      companyId: ['',[]],
      companyName: ['', [Validators.required]],
      companyShortCode: ['', [Validators.required]],
      created_at:['']
    });
    
    if(data && data.companyId){
      this.createCompanyForm.setValue({
        companyId:data.companyId,
        companyName:data.companyName,
        companyShortCode:data.companyShortCode,
        created_at:data.created_at
      });
      const ctrl = this.createCompanyForm.get('companyShortCode');
      ctrl.disable();
    }
  }

  openSnackBar(message: string, action: string,className:string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: [className],
      verticalPosition: 'bottom',
      horizontalPosition:'right'
    });
  }

  submitForm() {
    if (this.createCompanyForm.dirty && this.createCompanyForm.valid) {
      this.loader = true;
      let endPoint = (this.createCompanyForm.get('companyId').value != '')?'update-company':'create-company';
      this.restService.authPostData(endPoint,this.createCompanyForm.value)
      .subscribe(
        response => {
          if(response && response.success){
            this.dialogRef.close(response);
            this.openSnackBar(response.message,"",'green-snackbar')
          }
          this.loader = false;
        },
        error => {
          this.loader = false;
          this.openSnackBar(error.error.message,"",'red-snack-bar')
      });
    }
  }

  ngOnInit(): void {
  }

}
