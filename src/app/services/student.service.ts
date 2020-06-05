import { Injectable } from '@angular/core';

import { Student } from '../models/student.model';
import { Observable, of, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, mergeMap, toArray, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Course } from '../models/course.model';

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

  /** GET: get all students enrolled to course */
  getEnrolledStudents(course : Course) : Observable<Student[]>{
    return this.http.get<Student[]>(`${this.baseURL}/courses/${course.id}/students?_expand=team`)
      .pipe(
        //If I don't know a priori which data the server sends me --> map(res => res.map(r => Object.assign(new Student(), r))),
        tap(() => console.log(`fetched enrolled ${course.name} students - getEnrolledStudents()`)),
        catchError(this.handleError<Student[]>(`getEnrolledStudents(${course.name})`))
      );
  }

  /** PUT: enroll student to course */
  enrollStudents(students: Student[], course : Course): Observable<Student[]> {
    return from(students).pipe(
      mergeMap((student : Student) => {
        //Checking if ADD has been pressed without selecting a student (or modifying the selected one)
        if(typeof student === 'string') {
          this._toastrService.error(`${student} is not a valid Student, please select one from the options`, 'Error 😅');
          return of(null);
        }
        const url = `${this.baseURL}/students/${student.id}`;
        // Faking enroll
        student.courseId = course.id;
        return this.http.put<Student>(url, Student.export(student), this.httpOptions).pipe(
          tap(s => {
            this._toastrService.success(`Enrolled ${Student.displayFn(s)} to ${course.name}`, 'Congratulations 😃');
            console.log(`enrolled ${Student.displayFn(s)} - enrollStudents()`);
          }),
          catchError(this.handleError<Student>(`enrollStudents(${Student.displayFn(student)}, ${course.name})`))
        );
      }),
      toArray()
    );
  };

  /** PUT: unenroll student from the course */
  unenrollStudents(students: Student[], course : Course): Observable<Student[]> {
    return from(students).pipe(
      mergeMap(student => {
        const url = `${this.baseURL}/students/${student.id}`;
        // Faking unenroll, remove also the team
        student.courseId = 0; 
        student.teamId = 0;
        return this.http.put<Student>(url, Student.export(student), this.httpOptions).pipe(
          tap(s => {
            this._toastrService.success(`Unenrolled ${Student.displayFn(s)} from ${course.name}`, 'Congratulations 😃')
            console.log(`unenrolled ${Student.displayFn(s)} - unenrollStudents()`);
          }),
          catchError(this.handleError<Student>(`unenrollStudents(${Student.displayFn(student)}, ${course.name})`))
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
      catchError(this.handleError<Student[]>(`searchStudents(${name})`, [], false))
    );
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

  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UNUSED @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

  /** GET: get all students */
  getStudents() : Observable<Student[]>{
    return this.http.get<Student[]>(`${this.baseURL}/students?_expand=team`)
      .pipe(
        //If I don't know a priori which data the server sends me --> map(res => res.map(r => Object.assign(new Student(), r))),
        tap(_ => console.log('fetched students - getStudents()')),
        catchError(this.handleError<Student[]>('getStudents()'))
      );
  }
  
  /** POST: create students */
  createStudents(students: Student[]) : Observable<Student[]> {
    return from(students).pipe(
      mergeMap(student => {
        return this.http.post<Student>(`${this.baseURL}/students`, Student.export(student), this.httpOptions).pipe(
          tap(s => {
            this._toastrService.success(`Created ${Student.displayFn(s)}`, 'Congratulations 😃');
            console.log(`created student ${Student.displayFn(s)} - createStudent()`);
          }),
          catchError(this.handleError<Student>(`createStudent(${Student.displayFn(student)})`))
        )
      }),
      toArray()
    );
  }

  /** DELETE: delete student */
  deleteStudents(students: Student[]) {
    return from(students).pipe(
      mergeMap(student => {
        return this.http.delete(`${this.baseURL}/students/${student.id}`).pipe(
          tap(() => {
            this._toastrService.success(`Deleted ${Student.displayFn(student)}`, 'Congratulations 😃');
            console.log(`Deleted student ${Student.displayFn(student)} - deleteStudent()`);
          }),
          catchError(this.handleError<Student>(`deleteStudent(${Student.displayFn(student)})`))
        );
      })
    );
  }
}