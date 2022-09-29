import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  indiceSeleccionado: number = 0;

  paginas = [
    {
      titulo: 'Inicio',
      url: 'inicio',
      icono: 'home'
    },
    {
      titulo: 'Mis Notas',
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

  constructor(public alertController: AlertController,
    public navCtrl: NavController) { }

  ngOnInit() {
  }

  cambiarIndiceSeleccionado(i){
    console.log('12')
    this.indiceSeleccionado = i;
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
