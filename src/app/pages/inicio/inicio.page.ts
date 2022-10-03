import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonModal, NavController, ToastController} from '@ionic/angular';
import {initioService} from './service/initio.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  public term: string;
  courses: any[] = [];
  img: any;
  // tslint:disable-next-line:variable-name
  course_name: any;
  token = localStorage.getItem('token');
  isModalPay = false;
  tipo:any

  features:any[]=[
    {id:1, name:'CALIFICACIONES', src: '../../../assets/image/nota.png'},
    {id:2, name:'PAGOS', src: '../../../assets/image/pago.png'},
    {id:3, name:'HORARIO', src: '../../../assets/image/calendario.png'},
    {id:4, name:'ESTUDIO', src: '../../../assets/image/materiales.png'},
  ]

  constructor(public service: initioService, public navCtrl: NavController, public alertController: AlertController,) {
  }

  ngOnInit() {
    this.listCourses();
    this.refreshBanner();
    this.updateImage();
  }

  updateImage() {
    this.service.bannerObs.subscribe(data => {
      if (data){
        this.img = data.img;
        this.course_name = data.name_course;
      }
    });
  }

  refreshBanner(){
    const body = {};
    this.service.setUrlImag(body);
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

  setOpenPay(isOpen: boolean, tipo) {
    this.isModalPay = isOpen;
    this.tipo=tipo
  }

  navDetailDiplomate(diplomatCourse, imagen, course) {
    const body = {
      img: imagen,
      name_course: course,
    };
    this.service.setUrlImag(body);
    this.navCtrl.navigateRoot('menu/diplomado/detalle-diplomado/' + diplomatCourse);
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
        this.navCtrl.navigateRoot('menu/materiales/'+event);
        break;
      case null:
        alert('aun no')
        break;
    }
  }
}
