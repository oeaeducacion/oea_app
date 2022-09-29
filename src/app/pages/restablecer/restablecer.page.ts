import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ServiceRestablecer} from "./service/service.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {
  formularioRestablecer: FormGroup;
  token = localStorage.getItem('token');

  constructor(public fb: FormBuilder, private Service: ServiceRestablecer,
              public alertController: AlertController,) {
    this.formularioRestablecer = this.fb.group({
      dni: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
  }

  recuperar(){
    const jsonbody = {
      "num_documento": this.formularioRestablecer.controls['dni'].value,
    };

    this.Service.updatePassword(jsonbody, this.token).subscribe(async data => {
      if (data['success'] === true) {
        const alert = await this.alertController.create({
          header: 'GENIAL!',
          message: '¡Se envió un email a su correo electrónico!',
          buttons: ['Aceptar']
        });
        await alert.present();
        this.formularioRestablecer.reset();
      }
    },async error => {
      if (error.status === 400) {
        if (error.error.message != null) {
          const alert = await this.alertController.create({
            header: 'Datos incorrectos',
            message: 'El DNI no existe en la Base de Datos',
            buttons: ['Aceptar']
          });
          await alert.present();
        }
      }
    });
  }
}
