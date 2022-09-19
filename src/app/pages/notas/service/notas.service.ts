import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlEnviromentService} from '../../../shared/service/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class notasService {
  private headers = new HttpHeaders().set('Authorization', 'Token '+ localStorage.getItem('token'));

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getListCourses(token){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/notas/diplomados', {headers: headers});
  }

  getListModules(courses_code, token){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.get<any>(this.envUrl.urlAddress + 'alumno/notas/modulos/'+ courses_code, {headers: headers});
  }

  getRecordModule(body, token){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/notas/modulos/nota/',body, {headers: headers});
  }
}
