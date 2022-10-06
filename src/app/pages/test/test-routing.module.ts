import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestPage } from './test.page';

const routes: Routes = [
  {
    path: '',
    component: TestPage
  },
  {
    path: 'body',
    loadChildren: () => import('./body/body.module').then( m => m.BodyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestPageRoutingModule {}
