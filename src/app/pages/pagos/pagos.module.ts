import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagosPageRoutingModule } from './pagos-routing.module';

import { PagosPage } from './pagos.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PagosPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [PagosPage]
})
export class PagosPageModule {}
