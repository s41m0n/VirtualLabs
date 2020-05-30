import { Component, OnInit } from '@angular/core';

import { Student } from '../shared/models/student.model';
import { SnackBarService } from '../services/snack-bar.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit{

  enrolledStudents: Student[] = [];
  studentDB : Student[] = [];

  constructor(private _snackBarService : SnackBarService,
    private _studentService : StudentService) {}

  ngOnInit(): void {
    this._studentService.getStudents()
      .subscribe(students => this.studentDB = students);
    this._studentService.getEnrolledStudents()
      .subscribe(students => this.enrolledStudents = students);
  }

  unenrollStudents(students: Student[]) {
    this._studentService.unenrollStudents(students).subscribe(succUnenrolled => {
      this.enrolledStudents = this.enrolledStudents.filter(s => !succUnenrolled.includes(s));
      if(students.length === succUnenrolled.length) this._snackBarService.show(`😃 Successfully unrolled student${students.length > 1 ? 's' : ` ${students[0].serial}`}`);
      else this._snackBarService.show(`⛔ Fail unenroll student${students.length > 1 ? 's' : ` ${students[0].serial}`}`);
    });
  }

  enrollStudents(students: Student[]) {
    for(const student of students){
      if(!students) {
        return;
      }
      if(typeof student === 'string') {
        this._snackBarService.show("⛔ Please select one student between the options");
        return;
      }
      if(this.enrolledStudents.find(s => s.serial === student.serial)) {
        this._snackBarService.show(`⛔ Student ${student.serial} already in course`);
        return;
      } 
    }
    this._studentService.enrollStudents(students).subscribe(succEnrolled => {
      this.enrolledStudents = this.enrolledStudents.concat(succEnrolled);
      if(students.length === succEnrolled.length) this._snackBarService.show(`😃 Successfully enrolled student${students.length > 1? 's' : ` ${students[0].serial}`}`);
      else this._snackBarService.show(`⛔ Fail enroll student${students.length > 1 ? 's' : ` ${students[0].serial}`}`);
    });
  }
}
