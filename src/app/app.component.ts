import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'ai20-lab05';
  navLinks = [
    {
      label: 'Students',
      path: 'teacher/course/internet-applications/students'
    }, {
      label: 'Vms',
      path: 'teacher/course/internet-applications/vms'
    }, {
      label: 'Assignments',
      path: 'teacher/course/internet-applications/assignments'
    }, 
  ]
}

