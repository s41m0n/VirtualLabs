import { Injectable } from '@angular/core';

import { Student } from '../shared/models/student.model';
import { STUDENTS_DB } from '../shared/mocks/mock-student'; 
import { Observable, of, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  enrolledStudents : Student[] = STUDENTS_DB.slice(0, Math.ceil(STUDENTS_DB.length/2));
  studentDB : Student[] = STUDENTS_DB;
  studentsURL : string = 'http://localhost:3000/students';
  enrolledURL : string = 'http://localhost:3000/courses/1/students';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /** GET: get all students */
  getStudents() : Observable<Student[]>{
    return this.http.get<Student[]>(this.studentsURL)
      .pipe(
        tap(_ => console.log('fetched Students')),
        catchError(this.handleError<Student[]>('getStudents', []))
      );
  }

  /** GET: get all students enrolled to course */
  getEnrolledStudents(course : string = '') : Observable<Student[]>{
    return this.http.get<Student[]>(this.enrolledURL)
      .pipe(
        tap(_ => console.log('fetched enrolled Students')),
        catchError(this.handleError<Student[]>('getEnrolledStudents', []))
      );;
  }

  addStudent(student : Student) {
    this.studentDB.push(student);
  }

  removeStudent(student : Student) {
    this.studentDB = this.studentDB.filter(s => s.id !== student.id);
  }


  /** PUT: enroll student to course */
  enrollStudents(students: Student[], courseId : number = 1): Observable<Student[]> {
    return from(students).pipe(
      mergeMap(student => {
        const url = `${this.studentsURL}/${student.id}`;
        // Faking enroll
        student.courseId = 1;
        return this.http.put<Student>(url, student, this.httpOptions).pipe(
          tap(_ => console.log(`enrolled student`)),
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
        const url = `${this.studentsURL}/${student.id}`;
        // Faking unenroll
        student.courseId = 0;
        return this.http.put<Student>(url, student, this.httpOptions).pipe(
          tap(_ => console.log(`unenrolled student`)),
          catchError(this.handleError<Student>('unenrollStudents'))
        );
      }),
      toArray()
    );
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