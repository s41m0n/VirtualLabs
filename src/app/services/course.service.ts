import { Injectable } from '@angular/core';

import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, first, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courses: Observable<Course[]>;
  baseURL = 'api';

  constructor(private http: HttpClient,
    private _toastrService: ToastrService) {
      this.courses = this.getCourses();
    }

  getCourseByPath(name: string) : Observable<Course> {
    return this.courses.pipe(first(), map(res => res.find(x => x.path === name)));
  }

  private getCourses() : Observable<Course[]>{
    return this.http.get<Course[]>(`${this.baseURL}/courses`)
      .pipe(
        tap(res => {
          res.forEach(x => this.courses[x.path] = x);
          console.log(`fetched courses - getCourses()`);}
        ),
        catchError(this.handleError<Course[]>(`getCourses()`))
      )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T, show: boolean = true, message: string = 'An error occurred while performing') {
    return (error: any): Observable<T> => {
      const why = `${message} ${operation}: ${error}`;
      
      if(show) this._toastrService.error(why, 'Error 😅');
      console.log(why);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
