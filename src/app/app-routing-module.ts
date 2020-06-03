import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentsContComponent } from './teacher/students/students.container';
import { PageNotFoundComponent } from './fallback/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { VmsContComponent } from './teacher/vms/vms.container';
import { AuthGuard } from './helpers/auth.guard';
import { Role } from './models/role.model';

const routes = [
    { path: 'home', component: HomeComponent},
    { path:'teacher/course/internet-applications/students', component: StudentsContComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Professor]}},
    { path:'teacher/course/internet-applications/vms', component:  VmsContComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Professor]}},
    { path: '',   redirectTo: 'home', pathMatch: 'full' },
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