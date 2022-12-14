import { Component, OnInit, } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {initioService} from "../inicio/service/initio.service";
import {coursesService} from "./service/courses.service";

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {

  course_name: any[] = [];
  img: any;
  public url: any;
  public token = localStorage.getItem('token');
  public isProfile = false;
  public isMutualFriend = false;
  public isActiveFeed = false;
  public isIntroProfile = false;
  public isFollowers = false;
  public isFollowings = false;
  public isLatestPhotos = false;
  public isFriends = false;
  public bg_color:any;
  courseCode: any;
  modules: any[] = [];
  grabacion: any[] = [];
  tipo_material: any[] = [];
  public materials!: Array<any>;
  public workshops!: Array<any>;
  public evaluations!: Array<any>;
  action:any
  module_id:any;
  diplomado_id:any;
  id:any
  id_examen:any

  exam_expired:boolean=false
  exam_generated:boolean=false
  exam_finalizado:boolean=false
  btn_iniciar_exam:boolean=true
  nota:any

  constructor(public service: initioService, private route: ActivatedRoute,
              private diplomadoDetailService: coursesService) {
    this.courseCode = this.route.snapshot.params['code']
  }

  ngOnInit() {
    this.updateImage();
    this.getDetailDiplomado();
  }

  updateImage() {
    this.service.bannerObs.subscribe(data => {
      if (data){
        this.img = data['img'];
        this.course_name = data['name_course']
      }
    });
  }

  getDetailDiplomado() {
    this.diplomadoDetailService.getDetailDiplomadoByCode(this.token, this.courseCode).subscribe(resp => {
      console.log(resp)
      if (resp['success'] === true){
        let body = {
          'img': resp['data']['img'],
          'name_course': resp['data']['name_diplomado'],
        };
        this.diplomadoDetailService.setUrlImag(body);
        resp['data']['modulos'].forEach(i => {
          if(this.modules.length%2==0){
            this.bg_color = "primary"
          }else{
            this.bg_color = "light"
          }
          this.modules.push(
            {
              'id':i['id'],
              'num_module': i['module_number'],
              'name_module': i['module_name'],
              'bg_color': this.bg_color,
              'link':i['clase']
            },
          );
        });
      }
    })
  }

  abrirLink(url, mod_id, dip_id){
    this.checkAsistencia(mod_id,dip_id)
    window.open(url,'_blank');
  }

  checkAsistencia(mod_id, id){
    let body = {
      "course_code": this.courseCode,
      "modulo_id": mod_id,
      "diplomadoclase_id": id
    };
    this.diplomadoDetailService.marcarAsistencia(this.token, body).subscribe(resp => {
      if (resp['success'] === true){
      }
    });
  }

  clasesGrabadas(mod_id){
    this.grabacion = []
    let body = {
      "course_code": this.courseCode,
      "modulo_id": mod_id
    };
    this.diplomadoDetailService.clasesGrabadas(this.token, body).subscribe(resp => {
      if (resp['success'] === true){
        this.grabacion = resp['data'];
      }
    });
    this.module_id=mod_id;
  }

  getMaterials(num_module){
    this.materials = [];
    const body = {
      "course_code": this.courseCode,
      "num_module": num_module+1
    };

    this.diplomadoDetailService.getStudyMaterials(this.token,body).subscribe(res => {
      this.materials = res.material;
      let data = [];
      res.material.forEach(i => {
        if (data.length > 0){
          const found = data.find(
            (item) => item.type_material_id == i.type_material_id
          );
          if (found){
            console.log('no encontro el valor')
          }else {
            let json = {
              "type_material_id": i.type_material_id,
              "tipmat_name": i.tipmat_name,
            }
            data.push(json)
          }
        }else{
          let json = {
            "type_material_id": i.type_material_id,
            "tipmat_name": i.tipmat_name,
          }
          data.push(json)
        }
      })

      this.tipo_material = data


    })

  }

  getWorkshops(num_module){
    this.workshops = [];
    const body = {
      "course_code": this.courseCode,
      "num_module": num_module+1
    };

    this.diplomadoDetailService.getWorkshops(this.token,body).subscribe(res => {
      this.workshops = res.material;
    });

  }

  getEvaluations(num_module){
    this.evaluations = [];
    const body = {
      "course_code": this.courseCode,
      "num_module": num_module+1
    };

    this.diplomadoDetailService.getEvaluations(this.token,body).subscribe(res => {
      this.evaluations = res.data;
    });

  }

  /*LISTAR EXAMEN HANS*/
  getEvaluationsHans(num_module){
    this.evaluations = [];
    const body = {
      "course_code": this.courseCode,
      "modulo_id" : num_module
    };
    this.diplomadoDetailService.getEvaluationsHans(this.token,body).subscribe(res => {
      this.evaluations = res.data;
    });
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
        console.log(this.action)
        switch (this.action) {
          case 'evaluacion_finalizado':
            //this.openModalInfo()
            this.exam_finalizado=true
            this.exam_generated=false
            this.exam_expired=false
            this.btn_iniciar_exam=false
            //this.spinner.hide()
            break;
          case 'evaluacion_generado':
            //this.openModalInfo()
            this.exam_generated=true
            this.exam_expired=false
            this.exam_finalizado=false
            this.btn_iniciar_exam=true
            //this.spinner.hide()
            break;
          case 'evaluacion_expirado':
            //this.openModalInfo()
            this.exam_expired=true
            this.exam_generated=false
            this.exam_finalizado=false
            this.btn_iniciar_exam=false
            //this.spinner.hide()
            break;
          case 'evaluacion_reanudado':
            const url = '/alumno/examen/'+this.courseCode+'/'+this.id+'/'+this.id_examen;
            //return this.routes.navigate([url])
            //this.spinner.hide()
            break;
        }
      }
    });
  }

  //Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }
}
