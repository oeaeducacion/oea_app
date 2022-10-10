import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonModal, NavController, ToastController} from '@ionic/angular';
import {initioService} from "../inicio/service/initio.service";
import {MenuService} from "./service/menu.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  indiceSeleccionado: number = 0;

  paginas = [
    {
      titulo: 'Inicio',
      url: 'inicio',
      icono: 'home'
    },
    {
      titulo: 'Calificaciones',
      url: 'notas',
      icono: 'clipboard'
    },
    {
      titulo: 'Vivo',
      url: 'notas',
      icono: 'play-circle'
    },
    {
      titulo: 'Mis Pagos',
      url: 'pagos',
      icono: 'card'
    },
    {
      titulo: 'Perfil',
      url: 'perfil',
      icono: 'person'
    }
  ]

  isModalPay = false;
  link:any
  token = localStorage.getItem('token');
  tipo:any
  clase:any

  constructor(public alertController: AlertController,  public toastr: ToastController,
    public navCtrl: NavController, public service: MenuService,) { }

  ngOnInit() {
    this.listClase()
  }

  listClase(){
    this.service.getClaseLive(this.token).subscribe(resp => {
      if (resp['success']==true){
        this.clase=resp['data']
        this.link = resp['data']['url'];
      }
      else {
        this.link = null;
      }
    });
  }

  async abrirLink() {
    const alert = await this.alertController.create({
      header: 'CLASE',
      message: '¿Desea entrar a clase?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        }, {
          text: 'Si',
          handler: () => {
            window.open(this.link, '_blank')
            this.checkAsistencia()
          }
        }
      ]
    });
    await alert.present();
  }

  checkAsistencia(){
    let body = {
      "course_code": this.clase.diplomado_code,
      "modulo_id": this.clase.modulo_id,
      "diplomadoclase_id": this.clase.clase_id,
    };
    this.service.marcarAsistencia(this.token, body).subscribe(async resp => {
      if (resp['success'] === true) {
        const toast = await this.toastr.create({
          message: 'Check !',
          duration: 1000,
          color: "success"
        });
        toast.present();
      }
    });
  }

  cambiarIndiceSeleccionado(i){
    this.indiceSeleccionado = i;
  }

  setOpenPay(isOpen: boolean, tipo) {
    this.isModalPay = isOpen;
    this.tipo=tipo
  }

  navegar(event){
    this.modal.dismiss()
    this.isModalPay = false;
    switch (this.tipo){
      case 'CALIFICACIONES':
        this.navCtrl.navigateRoot('menu/notas/'+event);
        break;
      case 'PAGOS':
        this.navCtrl.navigateRoot('menu/pagos/'+event);
        break;
      case 'HORARIO':
        alert('aun no')
        break;
      case 'ESTUDIO':
        alert('aun no')
        break;
      case null:
        alert('aun no')
        break;
    }
  }

  async salir(){
    const alert = await this.alertController.create({
      header: 'Salir',
      message: '¿Deberitas te quieres salir?',
      buttons: [
        {
          text: 'No mejor no',
          handler: () => {

          }
        }, {
          text: 'Sii',
          handler: () => {
            localStorage.removeItem('ingresado');
            this.navCtrl.navigateRoot('login');
          }
        }
      ]
    });
    await alert.present();
  }
}
