import { EventEmitter, Component, OnInit, Input, Output } from '@angular/core';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() courses: any;
  @Input() tipo: any;
  code:any
  @Output('miEvento') miPrueba = new EventEmitter<any>()

  constructor(public navCtrl: NavController) {
  }

  ngOnInit() {
    console.log(this.tipo)
  }

  prueba(e){
    this.code=e
    switch (this.tipo){
      case 'CALIFICACIONES':
        this.miPrueba.emit(this.code)
        break;
      case 'PAGOS':
        this.miPrueba.emit(this.code)
        break;
      case 'HORARIO':

        break;
      case 'ESTUDIO':

        break;
      case null:

        break;
    }
  }
}
