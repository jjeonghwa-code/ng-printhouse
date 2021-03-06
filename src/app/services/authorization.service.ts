import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Store } from '@ngrx/store';
import { signBack, logout } from 'src/app/store/actions/auth.actions';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  token: string;
  constructor(
    private http: HttpClient,
    private store: Store <any>) {
  }
  login(name: string, password: string): Observable<any> {
    return this.http.post(`${environment.backendUrl}/login`, { name, password});
  }
  register(user: User): Observable<any> {
    return this.http.post(`${environment.backendUrl}/register`, user);
  }
  resetPassword() {
    return this.http.get('/movies');
  }
  signBack(token): Observable<any> {
    return this.http.post(`${environment.backendUrl}/signback`, {api_token: token});
  }
  checkLoginExpiration(): void {
    const loginDateString = localStorage.getItem('login_date');
    if (loginDateString) {
      const loginDate = new Date(loginDateString);
      const todayDate = new Date();
      const diffTime = Math.abs(todayDate.getTime() - loginDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        console.log('logout expire');
        localStorage.removeItem('login_date');
        localStorage.removeItem('token');
      } else {
        this.store.dispatch(signBack({ token: localStorage.getItem('token') }));
      }
    }
    else {
      this.store.dispatch(logout({}));
    }
  }
}
