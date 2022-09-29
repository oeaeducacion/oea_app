import { Component, OnInit } from '@angular/core';
import {coursesService} from "../course/service/courses.service";
import {initioService} from "../inicio/service/initio.service";
import {perfilService} from "./service/perfil.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  formularioPerfil: FormGroup=this.fb.group({
    email: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    celular: new FormControl('', Validators.required),
    profesion: new FormControl('', Validators.required),
    cep: new FormControl('', Validators.required)
  });

  course_name: any[] = [];
  img: any;
  have_info_profile:boolean=false
  profile:any
  token = localStorage.getItem('token');

  constructor(private diplomadoDetailService: coursesService, public service: initioService, private toastController: ToastController,
              private profileService: perfilService, public fb: FormBuilder,  public alertController: AlertController,
              private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.updateImage()
    this.diplomadoDetailService.setUrlImag(null);
    this.listInfoUser()
  }

  updateImage() {
    this.service.bannerObs.subscribe(data => {
      if (data){
        this.img = data['img'];
        this.course_name = data['name_course']
      }
    });
  }

  listInfoUser() {
    this.profileService.getInfoUser(this.token).subscribe(data => {
      if(Object.keys(data).length != 0){
        this.have_info_profile=true;
        this.profile = data['user_profile']['detail_user'];
        this.formularioPerfil.controls['direccion'].setValue(this.profile.direccion)
        this.formularioPerfil.controls['celular'].setValue(this.profile.telefono)
        this.formularioPerfil.controls['email'].setValue(this.profile.email)
        if(this.profile.user_config.info_student.num_colegiatura){
          this.formularioPerfil.controls['cep'].setValue(this.profile.user_config.info_student.num_colegiatura)
        }
        if(this.profile.user_config.info_student.profesion){
          this.formularioPerfil.controls['profesion'].setValue(this.profile.user_config.info_student.profesion)
        }
      }
    });
  }

  UpdateProfile() {
    this.showLoading()
    const jsonbody = {
      "email": this.formularioPerfil.controls['email'].value,
      "telefono":this.formularioPerfil.controls['celular'].value,
      "direccion":this.formularioPerfil.controls['direccion'].value,
      "num_colegiatura":this.formularioPerfil.controls['cep'].value,
      "profesion":this.formularioPerfil.controls['profesion'].value,
    };
    this.profileService.updateUser(jsonbody, this.token).subscribe(async data => {
      if (data['success'] === true) {
        const toast = await this.toastController.create({
          message: 'Perfil Actualizado!',
          duration: 1500,
          icon: 'checkmark-circle',
          color:'success'
        });
        await toast.present();
        this.formularioPerfil.reset();
        this.listInfoUser();
      }
      else {
        const toast = await this.toastController.create({
          message: 'Error !',
          duration: 1500,
          icon: 'alert-circle',
          color:'danger'
        });
        await toast.present();
      }
    });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando...',
      duration: 1000,
    });

    loading.present();
  }
}
