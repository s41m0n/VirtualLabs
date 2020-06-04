import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { first, switchMap, takeUntil, finalize } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students.container.html',
})
export class StudentsContComponent implements OnInit, OnDestroy{

  enrolledStudents: Student[] = [];
  filteredStudents : Observable<Student[]>;
  private searchTerms = new Subject<string>();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _toastrService : ToastrService,
    private _studentService : StudentService) {}
  
  ngOnInit(): void {
    this.getEnrolled();
    this.filteredStudents = this.searchTerms.pipe(
      takeUntil(this.destroy$),
      // switch to new search observable each time the term changes
      switchMap((name: string) => this._studentService.searchStudents(name)),
    );
  }

  /** Destroying subscription */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getEnrolled() {
    this._studentService.getEnrolledStudents()
    .pipe(first())
    .subscribe(students => this.enrolledStudents = students);
  }

  // Push a search term into the observable stream.
  searchStudents(name: string): void {
    this.searchTerms.next(name);
  }

  unenrollStudents(students: Student[]) {
    this._studentService.unenrollStudents(students)
      .pipe(
        first(),
        finalize(() => this.getEnrolled())
      )
      .subscribe();
  }

  enrollStudents(students: Student[]) {
    if(!students) return;
    if(students.some(x => typeof x === 'string')) {
      this._toastrService.error("Please select one student between the options");
      return;
    }
    this._studentService.enrollStudents(students)
      .pipe(
        first(),
        finalize(() => this.getEnrolled())
      )
      .subscribe();
  }
}
