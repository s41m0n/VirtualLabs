import { Injectable } from '@angular/core';

import { Student } from '../models/student.model';
import { Observable, of, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, mergeMap, toArray, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  baseURL : string = 'api/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    private _toastrService: ToastrService) {}

  /** GET: get all students */
  getStudents() : Observable<Student[]>{
    return this.http.get<Student[]>(`${this.baseURL}/students?_expand=team`)
      .pipe(
        //map(res => res.map(r => Object.assign(new Student(), r))),
        tap(_ => console.log('fetched students - getStudents()')),
        catchError(this.handleError<Student[]>('getStudents()'))
      );
  }

  /** GET: get all students enrolled to course */
  getEnrolledStudents(courseId : number = 1) : Observable<Student[]>{
    return this.http.get<Student[]>(`${this.baseURL}/courses/${courseId}/students?_expand=team`)
      .pipe(
        //map(res => res.map(r => Object.assign(new Student(), r))),
        tap(_ => console.log('fetched enrolled Students - getEnrolledStudents()')),
        catchError(this.handleError<Student[]>('getEnrolledStudents()'))
      );
  }

  /** PUT: enroll student to course */
  enrollStudents(students: Student[], courseId : number = 1): Observable<Student[]> {
    return from(students).pipe(
      mergeMap((student : Student) => {
        const url = `${this.baseURL}/students/${student.id}`;
        // Faking enroll
        student.courseId = courseId;
        return this.http.put<Student>(url, Student.export(student), this.httpOptions).pipe(
          tap(s => {
            this._toastrService.success(`Enrolled student ${Student.displayFn(s)}`, 'Congratulations 😃');
            console.log(`enrolled student ${Student.displayFn(s)} - enrollStudents()`);
          }),
          catchError(this.handleError<Student>('enrollStudents()'))
        );
      }),
      toArray()
    );
  };

  /** PUT: unenroll student from the course */
  unenrollStudents(students: Student[], courseId : number = 1): Observable<Student[]> {
    return from(students).pipe(
      mergeMap(student => {
        const url = `${this.baseURL}/students/${student.id}`;
        // Faking unenroll, do not remove the team
        student.courseId = 0;
        return this.http.put<Student>(url, Student.export(student), this.httpOptions).pipe(
          tap(s => {
            this._toastrService.success(`Unenrolled student ${Student.displayFn(s)}`, 'Congratulations 😃')
            console.log(`unenrolled student ${Student.displayFn(s)} - unenrollStudents()`);
          }),
          catchError(this.handleError<Student>('unenrollStudents()'))
        );
      }),
      toArray()
    );
  }

  /* GET students whose name contains search term */
  searchStudents(name: string): Observable<Student[]> {
    if (typeof name !== 'string' || !(name = name.trim()) || name.indexOf(' ') >= 0) {
      // if not search term, return empty student array.
      return of([]);
    }
    return this.http.get<Student[]>(`${this.baseURL}/students?name_like=${name}`).pipe(
      tap(x => console.log(`found ${x.length} results matching ${name} - searchStudents()`)),
      catchError(this.handleError<Student[]>('searchStudents()', [], false))
    );
  }

  /** POST: create a student */
  createStudent(student: Student) : Observable<Student> {
    return this.http.post<Student>(`${this.baseURL}/students`, student, this.httpOptions).pipe(
      tap(s => console.log(`created student ${Student.displayFn(s)} - createStudent()`)),
      catchError(this.handleError<Student>('createStudent()'))
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