// src/app/features/layout/layout.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule }   from '@angular/material/toolbar';
import { MatSidenavModule }   from '@angular/material/sidenav';
import { MatListModule }      from '@angular/material/list';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatMenuModule }      from '@angular/material/menu';
import { MatDividerModule }   from '@angular/material/divider';
import { MatBadgeModule }     from '@angular/material/badge';
import { MatTooltipModule }   from '@angular/material/tooltip';
import { RoleGuard }          from '../../core/guards/role.guard';
import { ShellComponent }     from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'productos',
        loadChildren: () => import('../productos/productos.module').then(m => m.ProductosModule) },
      { path: 'marcas',
        canActivate: [RoleGuard], data: { roles: ['ADMIN'] },
        loadChildren: () => import('../marcas/marcas.module').then(m => m.MarcasModule) },
      { path: 'cajas',
        loadChildren: () => import('../cajas/cajas.module').then(m => m.CajasModule) },
      { path: 'ventas',
        loadChildren: () => import('../ventas/ventas.module').then(m => m.VentasModule) },
      { path: 'reportes',
        canActivate: [RoleGuard], data: { roles: ['ADMIN'] },
        loadChildren: () => import('../reportes/reportes.module').then(m => m.ReportesModule) },
      { path: 'usuarios',
        canActivate: [RoleGuard], data: { roles: ['ADMIN'] },
        loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [ShellComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatDividerModule, MatBadgeModule, MatTooltipModule,
  ],
})
export class LayoutModule {}
