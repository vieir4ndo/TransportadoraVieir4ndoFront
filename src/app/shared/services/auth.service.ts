import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;
const AVATAR_URL = environment.avatarUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl: string = `${API_URL}/auth`;
  usersUrl : string = `${API_URL}/users`;

  helper = new JwtHelperService();
  decodedToken: any;
  currentUser: User | undefined;

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.authUrl + 'login', model).pipe(
      map((response: any) => {
        if (response.result.succeeded) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.decodedToken = this.helper.decodeToken(response.token);
          this.currentUser = response.user;
          this.validateAvatar();
        }
      })
    )
  }

  registerUser(model: any, type: string) {
    return this.http.post(this.usersUrl + 'create-' + type, model);
  }

  resetPassword(model: any) {
    return this.http.post(this.authUrl + 'reset-password', model);
  }

  confirmEmail(model: any) {
    return this.http.post(this.authUrl + 'confirm-email', model);
  }

  changePassword(model: any) {
    return this.http.post(this.authUrl + 'change-password', model);
  }

  loggedIn() {
    const token = localStorage.getItem('token') as string;
    return !this.helper.isTokenExpired(token);
  }

  logout(){
    this.currentUser = undefined;
    this.decodedToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  validateAvatar() : void{
    if (this.currentUser!.profileImageUrl == null){
      this.currentUser!.profileImageUrl = AVATAR_URL + this.currentUser!.username;
    }
  }
}
