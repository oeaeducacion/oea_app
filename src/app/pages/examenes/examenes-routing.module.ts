import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamenesPage } from './examenes.page';

const routes: Routes = [
  {
    path: '',
    component: ExamenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamenesPageRoutingModule {}
