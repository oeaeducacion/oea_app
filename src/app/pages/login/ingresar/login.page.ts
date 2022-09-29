import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { AlertController, NavController } from '@ionic/angular';
import {LoginuserService} from '../service/loginuser.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('passwordEyeRegister') passwordEye;
  passwordTypeInput  =  'password';
  iconpassword  =  'eye-off';

  formularioLogin: FormGroup;

  public show: boolean = false;
  navigate: any;
  roles: any;
  private secretrol = 'K56QSxGeKImwBRmiY';

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
      if(rus){
        this.CryptoJSAesDecrypt(this.secretrol, rus);
        return this.navCtrl.navigateRoot('menu/inicio');
      }
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
        let rol = this.CryptoJSAesEncrypt(this.secretrol, this.roles);
        localStorage.setItem('rus',rol);
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

  showPassword() {
    this.show = !this.show;
  }

  CryptoJSAesEncrypt(passphrase, plaintext) {

    var salt = CryptoJS.lib.WordArray.random(256);
    var iv = CryptoJS.lib.WordArray.random(16);

    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999 });

    var encrypted = CryptoJS.AES.encrypt(plaintext, key, {iv: iv});

    var data = {
      ciphertext : CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
      salt : CryptoJS.enc.Hex.stringify(salt),
      iv : CryptoJS.enc.Hex.stringify(iv)
    };

    return JSON.stringify(data);
  }

  CryptoJSAesDecrypt(passphrase, encryptedJsonString) {
    var objJson = JSON.parse(encryptedJsonString);
    var encrypted = objJson.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(objJson.salt);
    var iv = CryptoJS.enc.Hex.parse(objJson.iv);
    var key = CryptoJS.PBKDF2(passphrase, salt, {hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999});
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {iv: iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordEye.el.setFocus();
  }
}
