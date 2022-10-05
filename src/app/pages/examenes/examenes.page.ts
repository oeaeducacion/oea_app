import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {IonModal, LoadingController, NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {coursesService} from "../course/service/courses.service";
import {registerLocaleData} from "@angular/common";
import localeEs from "@angular/common/locales/es";
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
              private loadingCtrl: LoadingController,) {
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

  diplomado:any
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

  action_Evaluation(id, id_examen){
    this.id=id
    this.id_examen=id_examen
    const body = {
      "ficha_evaluacion_id": id_examen,
    };
    this.diplomadoDetailService.get_Action(this.token,body).subscribe(res => {
      if(res['success']==true){
        this.action=res['accion']
        switch (this.action) {
          case 'evaluacion_finalizado':
            this.exam_finalizado=true
            this.setOpenPay(true)
            break;
          case 'evaluacion_generado':
            this.showModal()
            break;
          case 'evaluacion_expirado':
            this.showModal()
            break;
          case 'evaluacion_reanudado':
            this.navCtrl.navigateRoot('menu/');
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

  volver(){
    this.navCtrl.navigateRoot('menu/diplomado/'+this.code);
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

  async showModal() {
    const loading = await this.loadingCtrl.create({
      message: 'Sesión Expirada!',
      duration: 2000,
    });
    loading.present();
  }

  setOpenPay(isOpen: boolean) {
    console.log(this.exam_finalizado)
    this.isModalPay = isOpen;
  }
}
