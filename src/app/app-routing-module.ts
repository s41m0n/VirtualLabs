import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentsContComponent } from './teacher/students-cont.component';
import { PageNotFoundComponent } from './PageNotFoundComponent';
import { HomeComponent } from './HomeComponent';
import { VmsContComponent } from './teacher/vms-cont.component';
import { AuthGuard } from './helpers/auth.guard';

const routes = [
    { path: 'home', component: HomeComponent},
    { path:'teacher/course/internet-applications/students', component: StudentsContComponent, canActivate: [AuthGuard]},
    { path:'teacher/course/internet-applications/vms', component:  VmsContComponent, canActivate: [AuthGuard]},
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