import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
    {
      path: 'inicio',
      loadChildren: () => import('../inicio/inicio.module').then( m => m.InicioPageModule)
    },
    {
      path: 'diplomado/:code',
      loadChildren: () => import('../course/course.module').then( m => m.CoursePageModule)
    },
    {
      path: 'notas/:code',
      loadChildren: () => import('../notas/notas.module').then( m => m.NotasPageModule)
    },
    {
      path: 'perfil',
      loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
    },
    {
      path: 'pagos/:code',
      loadChildren: () => import('../pagos/pagos.module').then( m => m.PagosPageModule)
    },
    {
      path: 'materiales/:code',
      loadChildren: () => import('../materiales/materiales.module').then( m => m.MaterialesPageModule)
    },
    {
      path: 'detalle/:code/:module',
      loadChildren: () => import('../detail-course/detail-course.module').then( m => m.DetailCoursePageModule)
    },
    {
      path: 'examenes/:code',
      loadChildren: () => import('../examenes/examenes.module').then( m => m.ExamenesPageModule)
    },
    {
      path: 'test/:code/:modulo_id/:id_examen',
      loadChildren: () => import('../test/test.module').then( m => m.TestPageModule)
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
