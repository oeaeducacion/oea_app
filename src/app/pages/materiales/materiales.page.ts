import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {coursesService} from "../course/service/courses.service";
import {LoadingController, NavController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.page.html',
  styleUrls: ['./materiales.page.scss'],
})
export class MaterialesPage implements OnInit {

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

  constructor( private route: ActivatedRoute,  private diplomadoDetailService: coursesService,  public navCtrl: NavController,
               private loadingCtrl: LoadingController,  public toastr: ToastController,)
  {
    this.courseCode = this.route.snapshot.params['code']
  }

  courseCode:any
  diplomado:any
  materials:any
  modules:any=[]
  id_tipo:any
  num_module:any
  public token = localStorage.getItem('token');

  ngOnInit() {
    this.getDetailDiplomado()
  }

  getDetailDiplomado() {
    this.diplomadoDetailService.getDetailDiplomadoByCode(this.token, this.courseCode).subscribe(resp => {
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
          this.modules.push(
            {
              'id':i['id'],
              'num_module': i['module_number'],
              'name_module': i['module_name'],
              'link':i['clase'],
              'clases':i['module_detail']['clases']
            },
          );
        });
      }
    },error => {
      if (error.status == 401) {
        this.showExpired()
      }
    })
  }

  getMaterials(num_module, id){
    this.materials=[]
    this.showLoading()
    this.id_tipo=id
    this.num_module=num_module
    const body = {
      "course_code": this.courseCode,
      "num_module": num_module
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

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Buscando..',
      duration: 1000,
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
}
