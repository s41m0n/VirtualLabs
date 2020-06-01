import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login-dialog.component';
import { AuthService } from './services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './models/user.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'ai20-lab05';
  currentUser : User;
  navLinks = [
    {
      label: 'Students',
      path: 'teacher/course/internet-applications/students'
    }, {
      label: 'Vms',
      path: 'teacher/course/internet-applications/vms'
    }, {
      label: 'Assignments',
      path: 'teacher/course/internet-applications/assignments'
    }, 
  ]

  constructor(public dialog: MatDialog,
    private _authService : AuthService,
    private route: ActivatedRoute,
    private router: Router) {
      this._authService.currentUser
        .subscribe((currentUser: User)  => this.currentUser = currentUser);
      this.route.queryParams
        .subscribe(queryParam => {
          if(queryParam && queryParam.doLogin) this.openLogin();
      });
    }

  openLogin() {
    const dialogRef = this.dialog.open(LoginDialogComponent);
  
    dialogRef.afterClosed()
      .pipe(first())
      .subscribe(result => {
        if(result) this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || '/']);
        else this.router.navigate(['/']);
    });
  }

  logout() {
    this._authService.logout();
    this.router.navigate(['/']);
  }
}

