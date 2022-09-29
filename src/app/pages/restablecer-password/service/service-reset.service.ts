import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlEnviromentService} from "../../../shared/service/url-enviroment.service";

@Injectable({
  providedIn: 'root'
})
export class ServiceResetService {

  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn')  || 'false');
  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  validateCode(data, token){
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'users/validar-codigo-url/', data, {headers: headers})
  }

  restorePassword(data, token){
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'users/reestablecer-password/', data, {headers: headers})
  }
}
