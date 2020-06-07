import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Authentication Guard service
 * 
 *  This service is responsible of checking if the user is authenticated and is allowed
 *  to perform the required operation depending on its privileges.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private _authService: AuthService
    ) {}

    /** Method called to perform the checks */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this._authService.currentUserValue;
        // Check if the user is logged
        if(!currentUser) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/'], { queryParams: { returnUrl: state.url, 'doLogin': true } });
            return false;
        }
        // check if route is restricted by role
        if (route.data.roles && !route.data.roles.includes(currentUser.role)) {
            // role not authorised so redirect to home page
            this.router.navigate(['/']);
            return false;
        }
 
        // authorized so return true
        return true;
    }
}