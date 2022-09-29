import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../../shared/service/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceRestablecer {

  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn')  || 'false');
  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  updatePassword(data, token){
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'users/email-reestablecer-password/', data, {headers: headers})
  }
}
