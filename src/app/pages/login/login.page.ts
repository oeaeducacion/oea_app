import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import {LoginuserService} from './service/loginuser.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  constructor(public fb: FormBuilder,
              public alertController: AlertController,
              public navCtrl: NavController, private loginuserService: LoginuserService) {

    this.formularioLogin = this.fb.group({
      nombre: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

  }
  ngOnInit() {
    this.verifyIsLogout();
  }

  verifyIsLogout(){
    const  tokenAuth = localStorage.getItem('token');
    if (tokenAuth != null){
      const rus = localStorage.getItem('rus');
    }
  }

  login(){
    const f = this.formularioLogin.value;

    const body = {
      username: f.nombre,
      password:  f.password
    };

    this.loginuserService.login(body).subscribe(async resp => {
      if (resp.success === true) {
        localStorage.setItem('token', resp.token);
        this.loginuserService.setLoggedIn(true);
        localStorage.setItem('ingresado', 'true');
        this.navCtrl.navigateRoot('menu/inicio');
      } else {
        const alert = await this.alertController.create({
          header: 'Datos incorrectos',
          message: 'Los datos que ingresaste son incorrectos.',
          buttons: ['Aceptar']
        });

        await alert.present();
      }
    }, async error => {
      if (error.status === 400) {
        const alert = await this.alertController.create({
          header: 'Datos incorrectos',
          message: 'Los datos que ingresaste son incorrectos.',
          buttons: ['Aceptar']
        });

        await alert.present();
      }
    });
  }

  async ingresar(){
    const f = this.formularioLogin.value;

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario.nombre == f.nombre && usuario.password == f.password){
      console.log('Ingresado');
      localStorage.setItem('ingresado', 'true');
      this.navCtrl.navigateRoot('menu/inicio');
    }else{
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Los datos que ingresaste son incorrectos.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }

}
