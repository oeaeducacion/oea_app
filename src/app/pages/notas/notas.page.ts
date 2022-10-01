import { Component, OnInit } from '@angular/core';
import {initioService} from "../inicio/service/initio.service";
import {coursesService} from "../course/service/courses.service";
import {notasService} from "./service/notas.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-notas',
  templateUrl: './notas.page.html',
  styleUrls: ['./notas.page.scss'],
})
export class NotasPage implements OnInit {
  course_name: any[] = [];
  img: any;

  token = localStorage.getItem('token')
  public courses: any;
  public modules!: Array<any>;
  public records!: Array<any>;
  public courses_code: any;
  public loading:boolean = false;

  constructor(public service: initioService, private diplomadoDetailService: coursesService,
              private noteStudentService: notasService,private route: ActivatedRoute,) {
    this.courses_code = this.route.snapshot.params['code']
  }

  ngOnInit() {
    //this.updateImage()
    this.getListCourses();
    this.getRecords()
    this.getModules()
  }

/*  updateImage() {
    this.service.bannerObs.subscribe(data => {
      if (data){
        this.img = data['img'];
        this.course_name = data['name_course']
      }
    });
  }*/

  getListCourses(){
    this.noteStudentService.getListCourses(this.token).subscribe( res => {
      let dip={}
      res['diplomados'].forEach(i=>{
        var splitted = i.course.courses_name.split(" ");
        var name = i.course.courses_name.split(" ");
        splitted.splice(0,3);
        name.splice(0,2);
        var primero = name.toString().charAt(0)
        var cadena= splitted.toString();
        let nueva = 'D'+primero+': '+cadena.replace(/_|#|-|@|<>|,/g, " ")
        if(i.course.courses_code==this.courses_code){
          dip={
            "courses_code": i.course.courses_code,
            "courses_name": nueva,
            "promedio_final": i.promedio_final
          }
          return
        }
      })
      console.log(dip)
      this.courses = dip;
    });
  }

  getModules(){
    if(this.courses_code!= ""){
      this.noteStudentService.getListModules(this.courses_code, this.token).subscribe(res => {
        if(res.success==true){
          this.modules = res.data;
          console.log(this.records)
          console.log(this.modules)
        }
      });
    }
  }

  getRecords(){
    let note=[]
    for(let i=1; 8>i; i++){
      let body = {
        "course_code": this.courses_code,
        "num_module": i
      };
      this.noteStudentService.getRecordModule(body, this.token).subscribe(res => {
        if(res.success==true) {
          note.push({
            'num_modulo':res.data.num_modulo,
            'detalle_nota': res.data.detalle_nota
          })
        }
      });
    }
    this.records = note;
  }
}
