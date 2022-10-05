import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamenesPageRoutingModule } from './examenes-routing.module';

import { ExamenesPage } from './examenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamenesPageRoutingModule
  ],
  declarations: [ExamenesPage]
})
export class ExamenesPageModule {}
