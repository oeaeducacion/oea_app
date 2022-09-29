import { Component, OnInit , ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ServiceRestablecer} from "../restablecer/service/service.service";
import {AlertController, NavController} from "@ionic/angular";
import {ActivatedRoute} from '@angular/router';
import {ServiceResetService} from "./service/service-reset.service";

@Component({
  selector: 'app-restablecer-password',
  templateUrl: './restablecer-password.page.html',
  styleUrls: ['./restablecer-password.page.scss'],
})
export class RestablecerPasswordPage implements OnInit {
  @ViewChild('passwordEyeRegister') passwordEye
  passwordTypeInput  =  'password';
  iconpassword  =  'eye-off';
  editPassword: FormGroup;
  token = localStorage.getItem('token');
  code:any
  public show: boolean = false;

  constructor(public fb: FormBuilder, private Service: ServiceResetService, public navCtrl: NavController,
              public alertController: AlertController, private route: ActivatedRoute,) {
    this.code = this.route.snapshot.params['code'];
    this.editPassword = this.fb.group({
      password_new: ['', Validators.required],
      password_confirmar: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.validationCode();
  }

  validationCode(){
    const jsonbody = {
      "url_code": this.code
    };

    this.Service.validateCode(jsonbody, this.token).subscribe(data => {
      if (data['success'] === true) {
        console.log('¡URL Válida!', '¡Genial!');
      }
    },error => {
      if(error.status===400){
        if(error.error.message!=null){
          console.log('La URL no existe', '¡Error!');
          return this.navCtrl.navigateRoot('/');
        }}
    });
  }

  async resetPassword() {
    const jsonbody = {
      "url_code": this.code,
      "new_password": this.editPassword.controls['password_new'].value
    };
    if (this.editPassword.controls['password_new'].value == this.editPassword.controls['password_confirmar'].value) {
      this.Service.restorePassword(jsonbody, this.token).subscribe(async data => {
        if (data['success'] === true) {
          const alert = await this.alertController.create({
            header: 'GENIAL!',
            message: '¡Se actualizó correctamente la contraseña!',
            buttons: ['Aceptar']
          });
          await alert.present();
          this.editPassword.reset();
          return this.navCtrl.navigateRoot('/');
        }
      }, async error => {
        if (error.status === 400) {
          if (error.error.message != null) {
            const alert = await this.alertController.create({
              header: 'Datos incorrectos',
              message: 'No se enviaron los datos correctamente',
              buttons: ['Aceptar']
            });
            await alert.present();
          }
        }
      });
    } else {
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Las Contraseñas No Coinciden',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

  showPassword() {
    this.show = !this.show;
  }

  togglePasswordMode() {
    this.passwordTypeInput  =  this.passwordTypeInput  ===  'text'  ?  'password'  :  'text';
    this.iconpassword  =  this.iconpassword  ===  'eye-off'  ?  'eye'  :  'eye-off';
    this.passwordEye.el.setFocus();
  }
}
