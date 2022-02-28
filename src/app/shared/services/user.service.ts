import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersUrl : string = `${API_URL}/users`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  updateClient(model: any) {
    let httpOption = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + localStorage.getItem('token') as string
      })
    };

    let formData = new FormData();
    formData.append("profileimage", model.profileimage, model.profileimage.name);
    formData.append("name", model.name);
    formData.append("adress", model.adress);
    formData.append("federalRegistration", model.federalRegistration);
    formData.append("email", model.email);
    
    console.log(formData);

    return this.http.put(
      this.usersUrl + 'update-client/' + this.authService.decodedToken.nameid,
      formData, httpOption)
      .pipe(
        map((response: any) => {
          if (response.result.succeeded) {
            this.authService.currentUser = response.user;
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        })
      )
  }
}
