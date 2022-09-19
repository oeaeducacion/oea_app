import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlEnviromentService} from '../../../shared/service/url-enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class pagosService {

  constructor(private httpClient: HttpClient, private envUrl: UrlEnviromentService) { }

  urlService = 'https://dniruc.apisperu.com/api/v1/ruc/';
  private tokenAuth = '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9lYS5lZHUucGVAZ21haWwuY29tIn0.SndLIG6HrOXax4awi_wAUvUrGM_CMSNM-E6k18tyyZM';

  getInfoBByRuc(ruc: string) {
    return this.httpClient.get<any>(this.urlService + ruc + this.tokenAuth);
  }


  getFinancial(token) {
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.get(this.envUrl.urlAddress + 'alumno/pagos/diplomados/', {headers: headers});
  }

  getDetalleFinancial(token, data: string) {
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.get(this.envUrl.urlAddress + 'alumno/pagos/detalle/'+ data, {headers: headers});
  }

  postPagoEfectivo(token, data) {
    const headers = new HttpHeaders().set('Authorization', 'Token '+ token);
    return this.httpClient.post<any>(this.envUrl.urlAddress + 'alumno/crear/pagoefectivo-mensualidad/', data, {headers: headers});
  }
}
