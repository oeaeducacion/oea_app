import { Component, OnInit, Input } from '@angular/core';
import {TesService} from "../service/tes.service";

@Component({
  selector: 'app-body',
  templateUrl: './body.page.html',
  styleUrls: ['./body.page.scss'],
})
export class BodyPage implements OnInit {
  public token = localStorage.getItem('token');

  constructor( private service: TesService, ) { }

  preguntas:any[]=[]

  @Input()examen:any;

  ngOnInit() {
    this.init()
  }

  init(){
    let preguntas=[]
    this.examen.formulario.forEach(a => {
      preguntas.push({
        'id': a.id,
        'preguntas': a.pregunta,
        'respuesta': a.alternativa
      })
    })
    this.preguntas=preguntas
  }

  changeAlternativas(id, event, id_pregunta){
    const body = {
      "ficha_evaluacion" : this.examen.ficha_evaluacion,
      "evaluacion_id" : this.examen.evaluacion_id,
      "id_pregunta" : id_pregunta,
      "id_respuesta" : id
    };
    this.service.sendRespuestas(this.token,body).subscribe(data => {
      console.log('RESPUESTA GUARDADA PAPU')
    })
  }

  changeAlternativaMultiple(id, event, id_pregunta){
    let id_respuesta=null
    if(event.target.checked==true){
      id_respuesta= id
    }
    const body = {
      "ficha_evaluacion_id" : this.examen.ficha_evaluacion,
      "evaluacion_id" : this.examen.evaluacion_id,
      "id_pregunta" : id_pregunta,
      "id_respuesta" : id_respuesta
    };
    this.service.sendRespuestas(this.token,body).subscribe(data => {
      console.log('RESPUESTA GUARDADA PAPU'+ id_respuesta)
    })
  }
}
