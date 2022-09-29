import { Component, OnInit } from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {initioService} from './service/initio.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public term: string;
  courses: any[] = [];
  img: any;
  // tslint:disable-next-line:variable-name
  course_name: any;
  token = localStorage.getItem('token');

  features:any[]=[
    {id:1, name:'NOTAS', src: 'https://bit.ly/3y38vRU'},
    {id:2, name:'PAGOS', src: 'https://bit.ly/3RkkzVI'},
    {id:3, name:'HORARIO', src: 'https://bit.ly/3RkkzVI'},
    {id:4, name:'ESTUDIO', src: 'https://bit.ly/3RkkzVI'},
  ]

  constructor(public service: initioService, public navCtrl: NavController) {
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
      console.log(resp);
      if (resp){
        this.courses = resp['courses'];
      }
    });
  }

  navDetailDiplomate(diplomatCourse, imagen, course) {
    const body = {
      img: imagen,
      name_course: course,
    };
    this.service.setUrlImag(body);
    this.navCtrl.navigateRoot('menu/diplomado/detalle-diplomado/' + diplomatCourse);
  }
}
