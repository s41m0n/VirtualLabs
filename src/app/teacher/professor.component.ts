import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html'
})
export class ProfessorComponent {
  navLinks = [
    {
      label: 'Students',
      path: 'students'
    }, {
      label: 'Vms',
      path: 'vms'
    }, {
      label: 'Assignments',
      path: 'assignments'
    }
  ]
}