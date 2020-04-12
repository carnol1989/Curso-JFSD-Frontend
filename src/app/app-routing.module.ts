import { PersonaEdicionComponent } from './pages/persona/persona-edicion/persona-edicion.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaEspecialComponent } from './pages/venta/venta-especial/venta-especial.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'venta-especial', component: VentaEspecialComponent
  },
  {
    path: 'producto', component: ProductoComponent
  },
  {
    path: 'persona', component: PersonaComponent, children: [
      { path: 'nuevo', component: PersonaEdicionComponent },
      { path: 'edicion/:id', component: PersonaEdicionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
