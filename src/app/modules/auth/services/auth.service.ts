import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  path = environment.apiUrl + '/accesos';
  constructor(private http: HttpClient) { }

  login(usuario: User) {
    return this.http.post(this.path + '/genToken', usuario);
  }

  isLoggedIn() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token') ?? 'null';
      return this.http.get<any>(this.path + '/protectedRoute/' + token);
    }
    return of(false); 
  }
}
