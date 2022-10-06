import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestPageRoutingModule } from './test-routing.module';

import { TestPage } from './test.page';
import {BodyPageModule} from "./body/body.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TestPageRoutingModule,
        BodyPageModule
    ],
  declarations: [TestPage]
})
export class TestPageModule {}
