import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

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
      tap(s => console.log(`logged ${email} - ${password}`))
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}