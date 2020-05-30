import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar : MatSnackBar) {}

  /** Function to show status message after actions */
  show(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    })
  }
}