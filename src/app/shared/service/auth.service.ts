import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ChangePasswordRqPayload, LoginRequestPayload, LogoutRequestPayload, UpdatePasswordResponse, UserLogin, UserLogoutResponse } from 'src/app/@types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(requestPayload: LoginRequestPayload) {
    return this.http.put<UserLogin>(`${environment.camundaApiUrl}/login_vt`, requestPayload).pipe(map(data => {
      return data;
    }));
  }

  logOut(requestPayload: LogoutRequestPayload) {
    return this.http.put<UserLogoutResponse>(`${environment.camundaApiUrl}/logout_vt`, requestPayload).pipe(map(data => {
      return data;
    }));
  }

  changePassword(requestPayload: ChangePasswordRqPayload) {
    return this.http.put<UpdatePasswordResponse>(`${environment.camundaApiUrl}/updateMyPassword`, requestPayload).pipe(map(data => {
      return data;
    }));
  }
}
