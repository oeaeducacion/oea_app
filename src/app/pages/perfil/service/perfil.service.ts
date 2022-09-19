import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlEnviromentService} from '../../../shared/service/url-enviroment.service';
@Injectable({
  providedIn: 'root'
})
export class perfilService {

  private headers = new HttpHeaders().set('Authorization', 'Token '+ localStorage.getItem('token'));
  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }


  getInfoUser(token) {
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.get(this.envUrl.urlAddress + 'users/perfil-usuario/', {headers: headers});
  }
  ListUsers() {
    return this.httpClient.get(this.envUrl.urlAddress + 'users/list_users', {headers: this.headers});
  }

  saveInfoAditional(data, token){
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'users/guardar-informacion-adicional/', data, {headers: headers})
  }

  updateUser(data, token){
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'users/update-usuario/', data, {headers: headers})
  }

  updatePassword(data, token){
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.put<any>(this.envUrl.urlAddress + 'users/actualizar-password/', data, {headers: headers})
  }
}
