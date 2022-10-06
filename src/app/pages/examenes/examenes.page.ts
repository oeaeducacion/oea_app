import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonModal, LoadingController, NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {coursesService} from "../course/service/courses.service";
import {registerLocaleData} from "@angular/common";
import localeEs from "@angular/common/locales/es";
import {ExamService} from "./service/exam.service";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.page.html',
  styleUrls: ['./examenes.page.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' } ]
})
export class ExamenesPage implements OnInit {
  @ViewChild(IonModal) detalle: IonModal;

  code:any
  public token = localStorage.getItem('token');

  constructor(public navCtrl: NavController, private route: ActivatedRoute, private diplomadoDetailService: coursesService,
              private loadingCtrl: LoadingController, private service: ExamService,  public alertController: AlertController,) {
    this.code = this.route.snapshot.params['code']
  }

  id:any
  id_examen:any
  exam_expired:boolean=false
  exam_generated:boolean=false
  exam_finalizado:boolean=false
  isModalPay = false;
  btn_iniciar_exam:boolean=true
  action:any
  name_evaluacion:any

  diplomado:any
  examen:any
  nota_evaluacion:any
  preguntas:any
  modules:any=[]
  evaluations:any=[]

  ngOnInit() {
    this.getDetailDiplomado()
  }

  getDetailDiplomado() {
    this.diplomadoDetailService.getDetailDiplomadoByCode(this.token, this.code).subscribe(resp => {
      if (resp['success'] === true){
        var splitted = resp['data']['name_diplomado'].split(" ");
        var name = resp['data']['name_diplomado'].split(" ");
        splitted.splice(0,3);
        name.splice(0,2);
        var primero = name.toString().charAt(0)
        var cadena= splitted.toString();
        let nueva = 'D'+primero+': '+cadena.replace(/_|#|-|@|<>|,/g, " ")
        this.diplomado=nueva
        resp['data']['modulos'].forEach(i => {
          let evaluacion=[]
          const body = {
            "course_code": this.code,
            "modulo_id" : i.id
          };
          this.diplomadoDetailService.getEvaluationsHans(this.token,body).subscribe(res => {
            if (res.success == true) {
              evaluacion.push(res.data)
            }
          });
          this.modules.push(
            {
              'id':i['id'],
              'num_module': i['module_number'],
              'name_module': i['module_name'],
              'link':i['clase'],
              'clases':i['module_detail']['clases'],
              evaluacion
            },
          );
        });
        console.log(this.modules)
      }
    },error => {
      if(error.status==401){
        this.showExpired()
      }
    })
  }

  action_Evaluation(id, id_examen, name){
    this.id=id
    this.id_examen=id_examen
    this.name_evaluacion=name
    const body = {
      "ficha_evaluacion_id": id_examen,
    };
    this.diplomadoDetailService.get_Action(this.token,body).subscribe(res => {
      if(res['success']==true){
        this.action=res['accion']
        switch (this.action) {
          case 'evaluacion_finalizado':
            this.exam_finalizado=true
            this.showLoad()
            this.listExamenDetalle()
            this.setOpenPay(true)
            break;
          case 'evaluacion_generado':
            this.showModalGenerado()
            break;
          case 'evaluacion_expirado':
            this.showModalExpirado()
            break;
          case 'evaluacion_reanudado':
            this.navCtrl.navigateRoot('menu/test/'+this.code+'/'+this.id+'/'+this.id_examen);
            break;
        }
      }
      else {
        switch (res['accion']) {
          case 'token_expirado':
            this.showExpired()
            break;
          case 'no_existe_ficha_evaluacion':
            this.showExpired()
            break;
        }
      }
    });
  }

  listExamenDetalle(){
    const body = {
      "ficha_evaluacion_id": this.id_examen,
    };
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

  volver(){
    this.navCtrl.navigateRoot('menu/diplomado/'+this.code);
  }

  async showLoad() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando Examen....',
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

  async showModalExpirado() {
    const alert = await this.alertController.create({
      header: 'EXAMEN EXPIRADO',
      message: 'El examen pasó la fecha límite',
      buttons: [
        {
          text: 'Ok',
          handler: () => {

          }
        }
      ]
    });
    await alert.present();
  }

  async showModalGenerado() {
    const alert = await this.alertController.create({
      header: 'ESTÁS A PUNTO DE COMENZAR CON TU EXÁMEN',
      message: 'Al Iniciar Tendrás 1 Hora Para Terminar. Al Pasar La Hora El Exámen Se Bloqueará.',
      buttons: [
        {
          text: 'No, Cancelar',
          handler: () => {

          }
        }, {
          text: 'Si, Iniciar',
          handler: () => {
            this.openTest()
          }
        }
      ]
    });
    await alert.present();
  }

  setOpenPay(isOpen: boolean) {
    this.isModalPay = isOpen;
  }

  openTest(){
    const body = {
      "ficha_evaluacion_id": this.id_examen,
    };
    this.service.create_Evaluation_Estudent(this.token,body).subscribe(resp => {
      if(resp['success']==true){
        return  this.navCtrl.navigateRoot('menu/test/'+this.code+'/'+this.id+'/'+this.id_examen);
      }
    })
  }
}
