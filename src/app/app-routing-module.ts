import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentsContainer } from './teacher/students/students.container';
import { PageNotFoundComponent } from './fallback/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { VmsContainer } from './teacher/vms/vms.container';
import { AuthGuard } from './helpers/auth.guard';
import { Role } from './models/role.model';
import { ProfessorComponent } from './teacher/professor.component';
import { AssignmentsContainer } from './teacher/assignments/assignments.container';
import { CourseGuard } from './helpers/course.guard';

const routes = [
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { 
    path:'professor/courses/:coursename',
    component: ProfessorComponent,
    canActivate: [AuthGuard, CourseGuard],
    data: { roles: [Role.Admin, Role.Professor]},
    children: [
      { path: '',   redirectTo: 'students', pathMatch: 'full' },
      { path:'students', component: StudentsContainer},
      { path:'vms', component:  VmsContainer},
      { path:'assignments', component: AssignmentsContainer},
    ]
  },
  { path:'**', component: PageNotFoundComponent}
];

export const appRouting = RouterModule.forRoot(routes);
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false }),
    CommonModule
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }