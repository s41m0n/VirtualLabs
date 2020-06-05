import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login-dialog.component';
import { AuthService } from './services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './models/user.model';
import { first, catchError, takeUntil, tap } from 'rxjs/operators';
import { Course } from './models/course.model';
import { CourseService } from './services/course.service';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'ai20-lab05';
  currentUser : User;
  courseList: Observable<Course[]>;
  selectedCourseName: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public dialog: MatDialog,
    private _authService : AuthService,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router) {
      this._authService.currentUser.pipe(takeUntil(this.destroy$))
        .subscribe((currentUser: User)  => {
          this.currentUser = currentUser;
          if(currentUser) this.courseList = this.courseService.courses.pipe(first());
          else this.courseList = of([]);
      });

      this.route.queryParams.pipe(takeUntil(this.destroy$))
        .subscribe(queryParam => {
          if(queryParam && queryParam.doLogin) this.openLogin();
      });
    }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  selectCourse(name: string) {
    this.selectedCourseName = name;
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
    this.selectedCourseName = '';
    this._authService.logout();
    this.router.navigate(['/']);
  }
}

