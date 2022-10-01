import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonModal, NavController} from '@ionic/angular';
import {initioService} from "../inicio/service/initio.service";

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
  courses:any
  token = localStorage.getItem('token');
  tipo:any

  constructor(public alertController: AlertController,
    public navCtrl: NavController, public service: initioService,) { }

  ngOnInit() {
    this.listCourses()
  }

  listCourses() {
    this.service.getAllCoursesbyUser(this.token).subscribe(resp => {
      if (resp){
        let dip=[];
        resp['courses'].forEach(i=>{
          var splitted = i.course.courses_name.split(" ");
          var name = i.course.courses_name.split(" ");
          splitted.splice(0,3);
          name.splice(0,2);
          var primero = name.toString().charAt(0)
          var cadena= splitted.toString();
          let nueva = 'D'+primero+': '+cadena.replace(/_|#|-|@|<>|,/g, " ")
          dip.push({
            'courses_name': nueva,
            'courses_code': i.course.courses_code,
            'detail': i.course.detail,
            'is_active': i.is_active
          })
        })
        this.courses = dip;
      }
      console.log(this.courses);
    });
  }

  cambiarIndiceSeleccionado(i){
    this.indiceSeleccionado = i;
  }

  notas(){

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
        alert('aun no')
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
