import { Component, OnInit } from '@angular/core';
import {coursesService} from "../course/service/courses.service";
import {initioService} from "../inicio/service/initio.service";
import {perfilService} from "./service/perfil.service";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  course_name: any[] = [];
  img: any;
  have_info_profile:boolean=false
  profile:any
  token = localStorage.getItem('token');

  constructor(private diplomadoDetailService: coursesService, public service: initioService,
              private profileService: perfilService ) { }

  ngOnInit() {
    this.updateImage()
    this.diplomadoDetailService.setUrlImag(null);
    this.listInfoUser()
  }

  updateImage() {
    this.service.bannerObs.subscribe(data => {
      if (data){
        this.img = data['img'];
        this.course_name = data['name_course']
      }
    });
  }

  listInfoUser() {
    this.profileService.getInfoUser(this.token).subscribe(data => {
      if(Object.keys(data).length != 0){
        this.have_info_profile=true;
        this.profile = data['user_profile'];
      }
    });
  }
}
