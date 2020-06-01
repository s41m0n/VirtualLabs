import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';
import { SnackBarService } from '../services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  form : FormGroup;
  loginInvalid : boolean = false;
  returnUrl : string;

  constructor(private _fb : FormBuilder,
    private _authService : AuthService,
    private _snackBar : SnackBarService,
    public dialogRef: MatDialogRef<LoginDialogComponent>) {
    }

  ngOnInit(): void {
    this.form = this._fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }
  
  onSubmit() {
    if (this.form.invalid)
      return;
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;
    this._authService.login(email, password)
    .pipe(first())
    .subscribe(
      data => {
        this._snackBar.show("😃 Successfully logged in!");
        this.dialogRef.close(true);
      },
      error => {
        this.loginInvalid = true;
      });
  }
}