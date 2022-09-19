import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {coursesService} from "../course/service/courses.service";
import {pagosService} from "./service/pagos.service";
import { IonModal } from '@ionic/angular';
import {FormBuilder, Validators} from "@angular/forms";

enum disabledType {
  enabled,
  disabled
}
enum checkedType {
  unchecked,
  checked
}
@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.page.html',
  styleUrls: ['./pagos.page.scss'],
})
export class PagosPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  token = localStorage.getItem('token');
  diplomados: any[] = [];
  contado: any[] = [];
  color: any[] = [];
  checkbox: any[] = [];
  allmatricula: any[] = [];

  rucexist: any[];
  monto_total:number = 0;
  monto: any;
  nameruc: any;
  nameperson: any;
  have_info_profile = false;
  namepatrocinador: any;
  mostrarSelect: boolean = false;
  num_ruc: any;

  total: any;
  number: any;
  is_pay: boolean=false;
  bg_color:any;
  courseCode: string;
  detail_course: any[] = [];
  cursos: any[] = [];
  cuota: any[] = [];
  total2: any;
  total_final:any
  date: any[] = [];
  monto_final:number=0;

  firstName: string = null;
  selected: any = 27;
  optionCard = true;
  optionEfectivo = false;
  methodPay = 'card';
  btnPay: any = 'Pagar';
  fechanual: any = [];
  arrayMes: any = [];
  arrayCheck: any = [];
  iputCard = false;
  tipo_pago: any;
  codigo_pago: any;

  code: any;
  mes: any;
  ano: any;
  code_ccv:any;
  number_tarjet:any;
  holder: any;
  select_mes: any;
  select_ano: any;
  fecha_exp:any;
  visa:boolean=false;
  mastercard:boolean=false;
  american:boolean=false;
  code_diplo:any;
  fecha_ahora:any

  ocultar: boolean = true;
  mostrar_patrocinador: boolean = false;
  mostrar_pago: boolean = false;
  mostrar_efectivo: boolean = false;

  formReserva = this.fb.group({
    pago_check: [''],
  })
  formExcPay = this.fb.group({
    number_card: ['',],
    cvv: ['', ],
    month_expirate: [null],
    year_expirate: [null],
    ruc:[''],
    is_factura:[''],
    razon_social:['']
  });

  name: string;
  isModalOpen = false;
  isModalPay = false;

  constructor(private diplomadoDetailService: coursesService, private Service: pagosService,
              public fb: FormBuilder, public toastr: ToastController) { }

  ngOnInit() {
    this.diplomadoDetailService.setUrlImag(null);
    this.listDiplomado();
  }

  listDiplomado() {
    this.fecha_ahora=new Date()
    this.Service.getFinancial(this.token).subscribe(data => {
      let monto:number = 0
      if (data['success'] == 'true') {
        data['courses'].forEach(i => {
          i.detail_cart.cuotas.forEach(a=>{
            if (a['is_paid'] != true) {
              monto += +a.monto_pagar;
            }
          })
          if(this.color.length%2==0){
            this.bg_color = "primary"
          }else{
            this.bg_color = "dark"
          }
          var splitted = i.course.courses_name.split(" ");
          var name = i.course.courses_name.split(" ");
          splitted.splice(0,3);
          name.splice(0,2);
          var primero = name.toString().charAt(0)
          var cadena= splitted.toString();
          let nueva = 'D'+primero+': '+cadena.replace(/_|#|-|@|<>|,/g, " ")
          this.diplomados.push(
            {
              'is_paid': i.is_paid,
              'course': nueva,
              'price_diplomado': i['detail_cart']['contado'],
              'monto_pagar': i['detail_cart']['contado'],
              'code_course': i['course']['courses_code'],
              'bg_color': this.bg_color
            },
          );
        });
        this.total_final=monto+'.00'
        /*
        this.total = this.diplomados.reduce((
                acc,
                obj,
            ) => acc + (obj.monto_pagar),
            0);
        this.number = parseInt(this.total)+'.00'*/
      }
      else if (data['success'] == 'false') {
        alert('Estas al día en tus pagos 😄 ✅ ');
      }
    });
  }

  listaccordion(course) {
    this.Service.getDetalleFinancial(this.token, course).subscribe(data => {
      this.detail_course = data['diplomado']['detail_cart']['cuotas'];
      this.monto_total=0
      this.total2=0
      data['diplomado']['detail_cart']['cuotas'].forEach(i => {
        if (i['is_paid'] != true) {
          this.monto_total += +i.monto_pagar;
        }
      })
      this.total2=this.monto_total+'.00'
      this.generateCheckbox();
    });
    this.Service.getDetalleFinancial(this.token, course).subscribe(data => {
      this.cursos = data['diplomado']['course'];
    });
    this.Service.getDetalleFinancial(this.token, course).subscribe(data => {
      this.cuota = data['diplomado']['detail_cart'];
    });
  }

  id_temporal:any=null;

  generateCheckbox(){
    try {
      var cantidad = this.detail_course.length;
      this.id_temporal = null
      for (let i = 0; i < cantidad; i++) {
        if (this.detail_course[i]["is_paid"] == false && this.id_temporal == null) {
          this.id_temporal = i
          console.log(this.id_temporal)
        }
        this.checkbox.push({
          "id": i,
          "is_disabled": disabledType.disabled,
          "is_checked": checkedType.unchecked
        });
      }
      if (this.checkbox[this.id_temporal].is_disabled == disabledType.disabled) {
        this.checkbox[this.id_temporal].is_disabled = disabledType.enabled;
      }
    }
    catch (e) {
      return
    }
  }

  updateCheckbox(id, event){
    // console.log(this.id_temporal)
    var indice = id;
    if (event.target.checked == true) {
      this.is_pay=true;
      if (indice == this.detail_course.length-1) {
        this.checkbox[indice].is_checked = checkedType.checked;
        this.monto_final+= +this.detail_course[indice]['monto_pagar'];
        return;
      }
      this.checkbox[indice + 1].is_disabled = disabledType.enabled;
      this.checkbox[indice].is_checked = checkedType.checked;
      this.monto_final+= +this.detail_course[indice]['monto_pagar'];
    }
    else if (event.target.checked == false){
      for (let i = id+1; i < this.detail_course.length; i++) {
        if(this.checkbox[i].is_checked == true){
          this.monto_final-= +this.detail_course[i]['monto_pagar'];
        }
        this.checkbox[i].is_disabled = disabledType.disabled;
        this.checkbox[i].is_checked = checkedType.unchecked;
      }
      if(this.checkbox[id] == this.checkbox[this.id_temporal]){
        this.is_pay=false
      }
      if(this.checkbox[id].is_checked == true){
        this.monto_final-= +this.detail_course[id]['monto_pagar'];
      }
      this.checkbox[id].is_checked = checkedType.unchecked;
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.isModalOpen=false
    this.fecha_exp='';
    this.mostrar_pago=false;
    this.mostrar_efectivo=false;
    this.arrayCheck=[];
    this.is_pay=false
    this.mostrarSelect=false;
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this.isModalOpen=false
  }

  setOpen(isOpen: boolean, code) {
    this.isModalOpen = isOpen;

    this.code_diplo=code
    var cantidad = this.detail_course.length;
    for (let i = 0; i < cantidad; i++) {
      if(this.checkbox[i].is_checked===1){
        this.arrayCheck.push(i);
        console.log(this.arrayCheck)
      }
    }
    this.generateCheckbox()
  }

  setOpenPay(isOpen: boolean) {
    this.isModalPay = isOpen;
  }

  exectPayment(){
    this.payWithEfective();
  }

  realizarpagoEfectivo(){
    const jsonbody = {
      "indice": this.arrayCheck,
      "is_facture": this.formExcPay.controls['is_factura'].value,
      "ruc": this.formExcPay.controls['ruc'].value,
      "razon_social" : this.nameruc,
      "codigo_diplomado" : this.code_diplo
    };
    this.Service.postPagoEfectivo(this.token,jsonbody).subscribe(data => {
      if (data['success'] === true) {
        this.allmatricula = data['data'];
        this.codigo_pago=this.allmatricula['payment_code'];
        this.monto = +this.allmatricula['amount'] / 100;
        this.listaccordion(this.code_diplo);
        for (let i = 0; i < this.detail_course.length; i++) {
          this.checkbox[i].is_disabled = disabledType.disabled;
          this.checkbox[i].is_checked = checkedType.unchecked;
        }
        this.is_pay=false
        this.cancel()
        this.setOpenPay(true)
      }
    });
  }

  async copyCodigo() {
    const toast = await this.toastr.create({
      message: 'Código Copiado!',
      duration: 2000
    });
    toast.present();
  }

  payWithEfective(){
    this.realizarpagoEfectivo()
  }

  async openToast() {
    const toast = await this.toastr.create({
      message: 'It is a Toast Notification',
      duration: 5000
    });
    toast.present();
  }

  card(){
    this.tipo_pago='card';
    this.iputCard = true;
    this.optionCard = true;
    this.optionEfectivo = false;
    this.btnPay = 'Pagar';
    this.formExcPay.controls['number_card'].setValidators([Validators.required]);
    this.formExcPay.controls['month_expirate'].setValidators([Validators.required]);
    this.formExcPay.controls['year_expirate'].setValidators([Validators.required]);
    this.formExcPay.controls['cvv'].setValidators([Validators.required]);
    this.formExcPay.controls['number_card'].updateValueAndValidity();
    this.formExcPay.controls['month_expirate'].updateValueAndValidity();
    this.formExcPay.controls['year_expirate'].updateValueAndValidity();
    this.formExcPay.controls['cvv'].updateValueAndValidity();
  }

  validarTarjeta(event){
    const inputValue = event.target.value;
    if (inputValue.substring(0,1) == 4) {
      this.visa=true
    }
    else if (inputValue.substring(0,1) == 5) {
      this.mastercard=true
    }
    else if (inputValue.substring(0,1) == 3) {
      this.american=true
    }
    else {
      this.visa=false
      this.mastercard=false
      this.american=false
    }
  }

  optionFacture(event){
    let ischecked = event.target.checked;
    this.num_ruc=ischecked;
    if (ischecked === true){
      this.mostrarSelect = true
      this.formExcPay.controls['ruc'].setValidators([Validators.required]);
      this.formExcPay.controls['ruc'].updateValueAndValidity();
    }else{
      this.formExcPay.controls['ruc'].setValidators([]);
      this.formExcPay.controls['ruc'].updateValueAndValidity();
      this.formExcPay.controls['ruc'].setValue('');
      this.nameruc='';
      this.mostrarSelect = false
    }
  }

  getInfoByRuc(event){
    const inputValue = event.target.value;
    this.nameruc = null;
    if (inputValue.length === 11) {
      //this.spinner.show();
      this.formExcPay.controls['ruc'].enable();
      this.Service.getInfoBByRuc(this.formExcPay.controls['ruc'].value).subscribe(async data => {
        if (data['success'] === false) {
          this.nameruc = null;
          this.formExcPay.controls['ruc'].setValue('');
          const toast = await this.toastr.create({
            message: '¡RUC No Encontrado!',
            duration: 2000
          });
          toast.present();
          //this.spinner.hide();
        } else {
          this.have_info_profile = true;
          this.rucexist = data;
          const toast = await this.toastr.create({
            message: '¡RUC Encontrado!',
            duration: 2000
          });
          toast.present();
          //this.spinner.hide();
          this.nameruc = data['razonSocial'];
        }
      }, async error => {
        this.nameperson = null;
        this.formExcPay.controls['ruc'].setValue('');
        const toast = await this.toastr.create({
          message: '¡Ocurrió un error, inténtelo en un momento!',
          duration: 2000
        });
        toast.present();
        //this.spinner.hide();
      });
    }
  }
}
