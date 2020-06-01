import { Injectable } from '@angular/core';

import { Student } from '../models/student.model';
import { Observable, of, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  enrolledStudents : Student[] = [];
  studentDB : Student[] = [];
  baseURL : string = 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /** GET: get all students */
  getStudents() : Observable<Student[]>{
    return this.http.get<Student[]>(`${this.baseURL}/students`)
      .pipe(
        tap(_ => console.log('fetched Students')),
        catchError(this.handleError<Student[]>('getStudents', []))
      );
  }

  /** GET: get all students enrolled to course */
  getEnrolledStudents(course : string = '') : Observable<Student[]>{
    return this.http.get<Student[]>(`${this.baseURL}/courses/1/students`)
      .pipe(
        tap(_ => console.log('fetched enrolled Students')),
        catchError(this.handleError<Student[]>('getEnrolledStudents', []))
      );
  }

  /** PUT: enroll student to course */
  enrollStudents(students: Student[], courseId : number = 1): Observable<Student[]> {
    return from(students).pipe(
      mergeMap(student => {
        const url = `${this.baseURL}/students/${student.id}`;
        // Faking enroll
        student.courseId = 1;
        return this.http.put<Student>(url, student, this.httpOptions).pipe(
          tap(s => console.log(`enrolled student ${s.serial}`)),
          catchError(this.handleError<Student>('enrollStudents'))
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
        // Faking unenroll
        student.courseId = 0;
        return this.http.put<Student>(url, student, this.httpOptions).pipe(
          tap(s => console.log(`unenrolled student ${s.serial}`)),
          catchError(this.handleError<Student>('unenrollStudents'))
        );
      }),
      toArray()
    );
  }


  /** POST: create a student */
  createStudent(student: Student) : Observable<Student> {
    return this.http.post<Student>(`${this.baseURL}/students`, student, this.httpOptions).pipe(
      tap(s => console.log(`create student ${s.serial}`)),
      catchError(this.handleError<Student>('createStudent'))
    )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}