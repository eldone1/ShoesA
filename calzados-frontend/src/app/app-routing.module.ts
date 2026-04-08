import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard }   from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { RoleGuard }   from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // ── Auth (pública) ────────────────────────────────────────────────────────
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },

  // ── App protegida ─────────────────────────────────────────────────────────
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/layout/layout.module').then(m => m.LayoutModule),
  },

  // ── Fallback ──────────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
