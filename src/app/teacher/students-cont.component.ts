import { Component } from '@angular/core';

import { Student } from '../shared/models/student.model';
import { STUDENTS_DB } from '../shared/mocks/mock-student'; 

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent {

  enrolledStudents : Student[] = STUDENTS_DB.slice(0, Math.ceil(STUDENTS_DB.length/2))
  studentDB : Student[] = STUDENTS_DB;
  
}
