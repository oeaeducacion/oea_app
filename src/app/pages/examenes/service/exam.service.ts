import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlEnviromentService} from '../../../shared/service/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private _banne = new BehaviorSubject<any>({});
  readonly bannerObs = this._banne.asObservable();
  private headers = new HttpHeaders().set('Authorization', 'Token '+ localStorage.getItem('token'));

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  getDetailExamenResp(token, data){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post(this.envUrl.urlAddress + 'academico/evaluacion/estudiante/listar/evaluacion/',data, {headers: headers});
  }

  get_Nota(token, data:string){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.get(this.envUrl.urlAddress + 'academico/evaluacion/mostrar-nota-evaluacion/'+data, {headers: headers});
  }

  create_Evaluation_Estudent(token, body){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/evaluacion/crear-estudiante-evaluacion/',body, {headers: headers});
  }
}
