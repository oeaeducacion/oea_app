import { Injectable } from '@angular/core';
import {UrlEnviromentService} from '../../../shared/service/url-enviroment.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getClaseLive(token){
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.get(this.envUrl.urlAddress + 'alumno/listar-clases-en-vivo-estudiante/', {headers: headers})
  }
}
