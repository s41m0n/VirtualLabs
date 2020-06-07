import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { ToastrService } from 'ngx-toastr';

/**
 * AuthService service
 * 
 * This service is responsible of:
 *    - all the interaction with the IdentityProvider, to authenticate a user
 *    - keeping track of the currentLogged user and its token
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Current User Subject: keeps hold of the current value and emits it to any new subscribers as soon as they subscribe
  private currentUserSubject: BehaviorSubject<User>;
  //Current User Observable: allows other components to subscribe to the currentUser Observable but doesn't allow them to publish to the currentUserSubject
  public currentUser: Observable<User>;                      
  httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient,
    private _toastrService: ToastrService) {
    //Check if logged user via localStorage and set it;
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  /**
   * Function to return the current user behavioural value (called when a component cannot subscribe but needs immediately the value) 
   * @returns the current user
   */
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * Function to authenticate a user via the IdentityProvider
   * 
   * @param(email)    the login email
   * @param(password) the login password  
   */
  login(email: string, password: string) {
    return this.http.post<any>('api/login', {'email': email, 'password': password}, this.httpOptions).pipe(
      map(authResult => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        // Assigning the Admin Role since json-server-auth is not able to assign it directly in the jwt token
        const user = new User(email, authResult.accessToken, Role.Professor);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return authResult;
      }),
      tap(() => {
        this._toastrService.success(`Hi ${email}`, 'Awesome 😃');
        console.log(`logged ${email}`);
      }),
      catchError(err => {
        this._toastrService.error('Authentication failed', 'Error 😅');
        return throwError(err);
      })
    );
  }

  /**
   * Function to perform logout
   * 
   * Remove user from local storage and emits a new event with a null user.
   */
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this._toastrService.success(`Logout with success`, 'Awesome 😃');
    console.log(`logged out`);
  }
}