import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlEnviromentService} from '../../../shared/service/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class coursesService {

  private _banne = new BehaviorSubject<any>({});
  readonly bannerObs = this._banne.asObservable();
  private headers = new HttpHeaders().set('Authorization', 'Token '+ localStorage.getItem('token'));

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }


  getDetailDiplomadoByCode(token, data:string){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.get(this.envUrl.urlAddress + 'alumno/diplomado/listar-modulos/'+ data, {headers: headers});
  }

  getStudyMaterials(token, body){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/material-estudio/todos/',body, {headers: headers});
  }

  getWorkshops(token, body){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/talleres/todos/',body, {headers: headers});
  }

  getEvaluations(token, body){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/evaluaciones/todos/',body, {headers: headers});
  }

  /*EXAMEN HANS*/
  getEvaluationsHans(token, body){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/estudiante/listar-ficha-evaluacion/',body, {headers: headers});
  }

  get_Action(token, body){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/evaluacion/accion-ficha-evaluacion/',body, {headers: headers});
  }

  create_Evaluation_Estudent(token, body){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'academico/evaluacion/crear-estudiante-evaluacion/',body, {headers: headers});
  }

  marcarAsistencia(token, data){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/marcar-asistencia/',data, {headers: headers});
  }

  clasesGrabadas(token, data){
    const headers = new HttpHeaders().set('Authorization', 'Token ' + token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/listar/clase-grabada/',data, {headers: headers});
  }

  setUrlImag(body: any) {
    this._banne.next(body);
  }
}
