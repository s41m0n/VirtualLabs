import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CourseService } from '../services/course.service';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseGuard implements CanActivate {
    constructor(
        private router: Router,
        private _courseService: CourseService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
        return this._courseService.courses.pipe(first(), map(res => {
            if(res.find(x => x.path === route.params['coursename'])) {
                return true;
            }
            this.router.navigate(['/NotFound'], { skipLocationChange: true, preserveFragment: true,  replaceUrl: false });
            return false;
        }));
    }
}