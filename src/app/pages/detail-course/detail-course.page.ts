import {Component, OnInit, Input, LOCALE_ID} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoadingController, NavController, ToastController} from "@ionic/angular";
import {coursesService} from "../course/service/courses.service";
import {registerLocaleData} from "@angular/common";
import localeEs from "@angular/common/locales/es";
import {notasService} from "../notas/service/notas.service";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-detail-course',
  templateUrl: './detail-course.page.html',
  styleUrls: ['./detail-course.page.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' } ]
})
export class DetailCoursePage implements OnInit {

  tipo_material=[
    {
      name: 'Diapositivas',
      id: 3
    },
    {
      name: 'Adicional',
      id: 2
    },
    {
      name: 'Lectura',
      id: 1
    },
  ]
  moduleName:any
  diplomado:any
  public token = localStorage.getItem('token');

  constructor( private route: ActivatedRoute,public navCtrl: NavController,  private noteStudentService: notasService,
               private diplomadoDetailService: coursesService, private loadingCtrl: LoadingController,
               public toastr: ToastController,) {
    this.moduleName = this.route.snapshot.params['module']
    this.diplomado = this.route.snapshot.params['code']
  }

  modules:any
  code:any
  notas:any
  materials:any
  id_tipo:any
  num_module:any
  courses:any

  ngOnInit() {
    this.getDetailDiplomado();
    this.getListCourses()
  }

  getListCourses(){
    this.noteStudentService.getListCourses(this.token).subscribe( res => {
      let dip={}
      res['diplomados'].forEach(i=>{
        var splitted = i.course.courses_name.split(" ");
        var name = i.course.courses_name.split(" ");
        splitted.splice(0,3);
        name.splice(0,2);
        var primero = name.toString().charAt(0)
        var cadena= splitted.toString();
        let nueva = 'D'+primero+': '+cadena.replace(/_|#|-|@|<>|,/g, " ")
        if(i.course.courses_code==this.diplomado){
          dip={
            "courses_code": i.course.courses_code,
            "courses_name": nueva,
            "promedio_final": i.promedio_final
          }
          console.log(dip)
          this.courses = dip;
          return
        }
      })
    });
  }

  getDetailDiplomado() {
    this.code=this.diplomado
    this.diplomadoDetailService.getDetailDiplomadoByCode(this.token, this.diplomado).subscribe(resp => {
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
          if(i.module_name==this.moduleName){
            this.modules={
                'id':i['id'],
                'num_module': i['module_number'],
                'name_module': i['module_name'],
                'link':i['clase'],
                'clases':i['module_detail']['clases']
            }
            this.getRecords(i.module_number)
            this.num_module=i.module_number
            console.log(this.modules)
            return
          }
        });
      }
    })
  }

  getRecords(num_module) {
    let body = {
      "course_code": this.code,
      "num_module": num_module
    };
    this.diplomadoDetailService.getRecordModule(body, this.token).subscribe(res => {
      if (res.success == true) {
        this.notas=res.data
        console.log(this.notas)
      }
    });
  }

  getMaterials( id){
    this.showLoading()
    this.materials=[]
    this.id_tipo=id
    const body = {
      "course_code": this.code,
      "num_module": this.num_module
    };
    this.diplomadoDetailService.getStudyMaterials(this.token, body).subscribe(async res => {
      if (res.success == true) {
        if (res.material.length>0){
          const toast = await this.toastr.create({
            message: 'Material Econtrado!',
            duration: 2000,
            color: "success"
          });
          toast.present();
        }
        else {
          const toast = await this.toastr.create({
            message: 'Sin Materiales :c',
            duration: 2000,
            color: "danger"
          });
          toast.present();
        }
        this.materials = res.material
      }
    })
  }

  volver(){
    this.navCtrl.navigateRoot('menu/diplomado/'+this.code);
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Buscando..',
      duration: 1000,
    });
    loading.present();
  }
}
