import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TesService} from "./service/tes.service";
import {timer} from "rxjs";
import {AlertController, LoadingController, NavController} from "@ionic/angular";

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  public token = localStorage.getItem('token');

  constructor( private route: ActivatedRoute, private service: TesService,  private loadingCtrl: LoadingController,
               public navCtrl: NavController, public alertController: AlertController,) {
    this.id_examen = this.route.snapshot.params['id_examen'];
    this.courseCode = this.route.snapshot.params['code'];
  }

  id_examen:any
  courseCode:any
  examen:any
  public _examen:any;
  preguntas:any
  nota:boolean=false
  isModalPay = false;
  enviar:boolean=true
  exam_finalizado:boolean=true
  finalizar:boolean=true
  salir:boolean=false
  expirado:boolean = true;
  nota_evaluacion:any
  titulo:any
  _second = 1000;
  _minute = this._second * 60;
  _hour = this._minute * 60;
  _day = this._hour * 24;
  end: any;
  now: any;
  day: any;
  hours: any;
  minutes: any;
  seconds: any;
  distance:any
  source=timer(0,1000);

  ngOnInit() {
    this.showLoad()
    this.list()
    setTimeout(() => {
      this.now = new Date(this.examen.tiempo_inicio * 1000)
      this.end = new Date(this.examen.tiempo_fin * 1000);
      /*this.distance = this.end - this.now;*/
      this.source.subscribe(t => {
        let resta=this.examen.tiempo_inicio+t
        let fecha = new Date(resta*1000)
        this.showDate(fecha);
      });
    }, 3000);
  }

  showDate(fecha){
    if(this.distance<0){
      this.terminate()
      return
    }
    this.distance = this.end - fecha;
    this.day = Math.floor(this.distance / this._day);
    this.hours = Math.floor((this.distance % this._day) / this._hour);
    this.minutes = Math.floor((this.distance % this._hour) / this._minute);
    this.seconds = Math.floor((this.distance % this._minute) / this._second);
  }

  terminate(){
    setTimeout(() => {
      // spinner ends after 5 seconds
      this.showExamExpired()
      return  this.navCtrl.navigateRoot('menu/inicio');
    }, 2000);
  }

  list(){
    const body = {
      "ficha_evaluacion_id": this.id_examen,
    };
    this.service.getDetailExamen(this.token,body).subscribe(resp => {
      if(resp['success']==true) {
        this.examen = resp['data']
        this._examen = this.examen
      }
      else if(resp['success']==false){
        this.expirado=false
        this.showExist()
        return  this.navCtrl.navigateRoot('menu/inicio');
      }
      else if(resp['data']['activo']==false){
        this.expirado=false
        this.showExamExpired()
        return  this.navCtrl.navigateRoot('menu/inicio');
      }
      else if(resp['data']['is_finished']==true){
        this.expirado=false
        this.showExamExpired()
        return  this.navCtrl.navigateRoot('menu/inicio');
      }
    },error => {
      if (error.status === 401) {
        this.showExpired()
      }
    })
  }

  async showExist() {
    const loading = await this.loadingCtrl.create({
      message: 'NO EXISTE EXAMEN!',
      duration: 2000,
    });
    loading.present();
  }

  async showExamExpired() {
    const loading = await this.loadingCtrl.create({
      message: ' EXAMEN EXPIRADO!',
      duration: 2000,
    });
    loading.present();
  }

  async showLoad() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando Examen',
      duration: 2000,
    });
    loading.present();
  }

  async showExpired() {
    const loading = await this.loadingCtrl.create({
      message: 'Sesión Expirada!',
      duration: 2000,
    });
    loading.present();
    localStorage.removeItem('ingresado');
    this.navCtrl.navigateRoot('login');
  }

  async setOpen(isOpen: boolean, nota, titulo) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando',
      duration: 1000,
    });
    loading.present();
    this.isModalPay = isOpen;
    this.nota = nota
    this.titulo = titulo
    this.listExamenDetalle()
  }

  closeModal(isOpen: boolean){
    this.isModalPay = isOpen;
  }

  listExamenDetalle(){
    console.log(this.nota)
    const body = {
      "ficha_evaluacion_id": this.id_examen,
    };
    if(this.nota==true){
      this.service.getDetailExamenResp(this.token, body).subscribe(resp => {
        if (resp['success'] == true) {
          this.examen = resp['data']
          let preguntas = []
          this.examen.formulario.forEach(a => {
            let texto = null
            let result = null
            a.alternativa.forEach(r => {
              texto = r.texto
              result = r.resultado
            })
            preguntas.push({
              'id': a.id,
              'preguntas': a.pregunta,
              'respuesta': texto,
              'resultado': result
            })
          })
          this.preguntas = preguntas
          this.service.get_Nota(this.token, this.examen.evaluacion_id).subscribe(data => {
            if (data['success'] == true) {
              this.nota_evaluacion = data['data']['notes_evaluation']
            }
          })
        }
      })
    }
    if(this.nota==false){
      this.service.getDetailExamen(this.token, body).subscribe(resp => {
        if (resp['success'] == true) {
          this.examen = resp['data']
          let preguntas = []
          this.examen.formulario.forEach(a => {
            let texto = null
            let result = null
            a.alternativa.forEach(r => {
              if(r.seleccionado){
                texto= r.texto
              }
            })
            preguntas.push({
              'id': a.id,
              'preguntas': a.pregunta,
              'respuesta': texto
            })
          })
          this.preguntas = preguntas
        }
      })
    }
  }

  async finalizarExamen() {
    const alert = await this.alertController.create({
      header: 'ESTA SEGUR@ DE FINALIZAR EL EXAMEN?',
      buttons: [
        {
          text: 'No, Cancelar',
          handler: () => {

          }
        }, {
          text: 'Si, Terminar',
          handler: () => {
            this.finalizar_Examen(this.examen.evaluacion_id)
          }
        }
      ]
    });
    await alert.present();
  }

  finalizar_Examen(id){
    const body = {
      "evaluacion_id" : id,
      "estado" : true
    };
    this.service.end_Examen(this.token,body).subscribe(async resp => {
      if (resp['success'] == true) {
        this.closeModal(false)
        this.nota = true
        this.titulo = this._examen.nombre_formulario
        this.isModalPay = true;
        const loading = await this.loadingCtrl.create({
          message: 'Finalizando Examen',
          duration: 2000,
        });
        loading.present();
        this.listExamenDetalle()
      }
    })
  }

  async exit() {
    const loading = await this.loadingCtrl.create({
      message: 'Saliendo de Examen',
      duration: 2000,
    });
    loading.present();
    this.navCtrl.navigateRoot('menu/examenes/'+this.courseCode);
  }
}
