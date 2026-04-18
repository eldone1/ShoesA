// src/app/features/layout/shell/shell.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/auth.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: ('ADMIN' | 'CAJERO')[];
}

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  currentUser: AuthUser | null = null;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Nueva Venta', icon: 'point_of_sale', route: '/ventas/nueva' },
    {
      label: 'Mis Ventas',
      icon: 'receipt_long',
      route: '/ventas',
      roles: ['CAJERO'],
    },
    {
      label: 'Ventas',
      icon: 'receipt_long',
      route: '/ventas',
      roles: ['ADMIN'],
    },
    { label: 'Productos', icon: 'inventory_2', route: '/productos' },
    { label: 'Marcas', icon: 'label', route: '/marcas', roles: ['ADMIN'] },
    { label: 'Clientes', icon: 'people', route: '/clientes' },
    { label: 'Comprobantes', icon: 'receipt', route: '/comprobantes' },
    { label: 'Cajas', icon: 'local_atm', route: '/cajas' },
    {
      label: 'Reportes',
      icon: 'bar_chart',
      route: '/reportes',
      roles: ['ADMIN'],
    },
    { label: 'Usuarios', icon: 'people', route: '/usuarios', roles: ['ADMIN'] },
  ];

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    // Cerrar sidenav en mobile al navegar
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) this.sidenav?.close();
      });
  }

  get visibleNavItems(): NavItem[] {
    const rol = this.currentUser?.rol;
    return this.navItems.filter(
      (item) => !item.roles || item.roles.includes(rol as any),
    );
  }

  logout(): void {
    this.authService.logout();
  }

  get userInitials(): string {
    return (this.currentUser?.nombre ?? 'U')
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
