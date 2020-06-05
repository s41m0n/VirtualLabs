import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private _authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this._authService.currentUserValue;
        if(!currentUser) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/home'], { queryParams: { returnUrl: state.url, 'doLogin': true } });
            return false;
        }
        // check if route is restricted by role
        if (route.data.roles && !route.data.roles.includes(currentUser.role)) {
            // role not authorised so redirect to home page
            this.router.navigate(['/']);
            return false;
        }
 
        // authorised so return true
        return true;
    }
}