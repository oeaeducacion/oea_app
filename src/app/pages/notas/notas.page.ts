import { Component, OnInit } from '@angular/core';
import {initioService} from "../inicio/service/initio.service";
import {coursesService} from "../course/service/courses.service";
import {notasService} from "./service/notas.service";

@Component({
  selector: 'app-notas',
  templateUrl: './notas.page.html',
  styleUrls: ['./notas.page.scss'],
})
export class NotasPage implements OnInit {
  course_name: any[] = [];
  img: any;

  token = localStorage.getItem('token')
  public courses!: Array<any>;
  public modules!: Array<any>;
  public records!: Array<any>;
  public courses_code!: string;
  public loading:boolean = false;

  constructor(public service: initioService, private diplomadoDetailService: coursesService,
              private noteStudentService: notasService) { }

  ngOnInit() {
    this.diplomadoDetailService.setUrlImag(null);
    this.updateImage()
    this.getListCourses();
  }

  updateImage() {
    this.service.bannerObs.subscribe(data => {
      if (data){
        this.img = data['img'];
        this.course_name = data['name_course']
      }
    });
  }

  getListCourses(){
    this.noteStudentService.getListCourses(this.token).subscribe(res => {
      this.courses = res.diplomados;
    });
  }

  getModules(courses_code){
    if(courses_code!= ""){
      this.courses_code = courses_code;
      this.noteStudentService.getListModules(this.courses_code, this.token).subscribe(res => {
        this.modules = res.data;

      });
    }

  }

  getRecords(num_module){
    let body = {
      "course_code": this.courses_code,
      "num_module": num_module
    };
    if(num_module!=""){
      this.loading = true;
      this.noteStudentService.getRecordModule(body, this.token).subscribe(res => {
        this.loading = false;
        this.records = res.data.detalle_nota;

      });
    }

  }
}
