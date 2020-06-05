import { Component, OnInit, OnDestroy } from '@angular/core';

import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { first, switchMap, takeUntil, finalize } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students.container.html',
})
export class StudentsContainer implements OnInit, OnDestroy{
  course : Course;
  enrolledStudents: Student[] = [];
  filteredStudents : Observable<Student[]>;
  private searchTerms = new Subject<string>();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _studentService : StudentService,
    private _courseService: CourseService,
    private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.parent.params.pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this._courseService.getCourseByPath(params['coursename']).subscribe(res => {
          this.course = res;
          this.getEnrolled();
        });
      });
    
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

  // Push a search term into the observable stream.
  searchStudents(name: string): void {
    this.searchTerms.next(name);
  }

  unenrollStudents(students: Student[]) {
    this._studentService.unenrollStudents(students, this.course)
      .pipe(
        first(),
        finalize(() => this.getEnrolled())
      )
      .subscribe();
  }

  enrollStudents(students: Student[]) {
    this._studentService.enrollStudents(students, this.course)
      .pipe(
        first(),
        finalize(() => this.getEnrolled())
      )
      .subscribe();
  }

  private getEnrolled() {
    if(!this.course) return;
    this._studentService.getEnrolledStudents(this.course)
    .pipe(first())
    .subscribe(students => this.enrolledStudents = students);
  }
}
