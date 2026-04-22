/* // src/app/features/ventas/ventas-list/ventas-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { VentaService }      from '../../../core/services/venta.service';
import { AuthService }       from '../../../core/services/auth.service';
import { Venta }             from '../../../core/models/index';

@Component({
  selector: 'app-ventas-list',
  templateUrl: './ventas-list.component.html',
  styleUrls: ['./ventas-list.component.scss'],
})
export class VentasListComponent implements OnInit {
  ventas: Venta[] = [];
  loading = false;
  cajaId: number | null = null;
  isAdmin: boolean;

  inicio = new Date().toISOString().split('T')[0];
  fin    = new Date().toISOString().split('T')[0];

  displayedColumns = ['id', 'fecha', 'cajero', 'items', 'metodoPago', 'total', 'acciones'];
  expandedVenta: Venta | null = null;

  constructor(
    private ventaService: VentaService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.isAdmin = authService.isAdmin();
  }

  ngOnInit(): void {
    this.cajaId = this.route.snapshot.paramMap.get('id')
      ? +this.route.snapshot.paramMap.get('id')!
      : null;
    this.load();
  }

  load(): void {
    this.loading = true;
    const obs = this.cajaId
      ? this.ventaService.porCaja(this.cajaId)
      : this.isAdmin
        ? this.ventaService.porFecha(this.inicio, this.fin)
        : this.ventaService.misVentas(this.inicio, this.fin);

    obs.subscribe({
      next:  data => { this.ventas = data; this.loading = false; },
      error: ()   => { this.loading = false; },
    });
  }

  toggle(venta: Venta): void {
    this.expandedVenta = this.expandedVenta?.id === venta.id ? null : venta;
  }

  metodoPagoClass(m: string): string {
    return { EFECTIVO: 'chip-efectivo', YAPE: 'chip-yape', TARJETA: 'chip-tarjeta', PLIN: 'chip-plin' }[m] ?? '';
  }

  get totalDia(): number { return this.ventas.reduce((s, v) => s + v.total, 0); }
}
 */

// Despues

// src/app/features/ventas/ventas-list/ventas-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { VentaService }          from '../../../core/services/venta.service';
import { ComprobanteService }      from '../../../core/services/comprobante.service';
import { MatDialog }               from '@angular/material/dialog';
import { AuthService }       from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { Venta, ComprobanteResponse, MetodoPago, User } from '../../../core/models/index';

@Component({
  selector: 'app-ventas-list',
  templateUrl: './ventas-list.component.html',
  styleUrls: ['./ventas-list.component.scss'],
})
export class VentasListComponent implements OnInit {
  ventas: Venta[] = [];
  loading = false;
  cajaId: number | null = null;
  isAdmin: boolean;

  inicio = new Date().toISOString().split('T')[0];
  fin    = new Date().toISOString().split('T')[0];
  cajeros: User[] = [];
  cajeroIdFiltro: number | null = null;
  metodoPagoFiltro: MetodoPago | null = null;
  readonly metodosPago: MetodoPago[] = ['EFECTIVO', 'YAPE', 'TARJETA'];

  displayedColumns = ['id', 'fecha', 'cajero', 'items', 'metodoPago', 'total', 'comprobante', 'acciones'];
  expandedVenta: Venta | null = null;
  comprobantesMap: Map<number, ComprobanteResponse> = new Map();

  constructor(
    private ventaService: VentaService,
    private authService: AuthService,
    private userService: UserService,
    private comprobanteService: ComprobanteService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.isAdmin = authService.isAdmin();
  }

  ngOnInit(): void {
    this.cajaId = this.route.snapshot.paramMap.get('id')
      ? +this.route.snapshot.paramMap.get('id')!
      : null;

    if (!this.cajaId && this.isAdmin) {
      this.loadCajeros();
    }

    this.load();
  }

  loadCajeros(): void {
    this.userService.listar().subscribe({
      next: users => {
        this.cajeros = users.filter(u => u.rol === 'CAJERO' && u.activo);
      },
      error: () => {
        this.cajeros = [];
      },
    });
  }

  load(): void {
    this.loading = true;
    const obs = this.cajaId
      ? this.ventaService.porCaja(this.cajaId)
      : this.isAdmin
        ? this.ventaService.porFechaFiltrada(this.inicio, this.fin, this.cajeroIdFiltro, this.metodoPagoFiltro)
        : this.ventaService.misVentas(this.inicio, this.fin);

    obs.subscribe({
      next:  data => { this.ventas = data; this.loading = false; },
      error: ()   => { this.loading = false; },
    });
  }

  toggle(venta: Venta): void {
    this.expandedVenta = this.expandedVenta?.id === venta.id ? null : venta;
  }

  emitirComprobante(venta: Venta, event: Event): void {
    event.stopPropagation();
    // Importamos el dialog de forma dinámica para evitar dependencia circular
    import('../../comprobantes/emitir-comprobante-dialog/emitir-comprobante-dialog.component')
      .then(m => {
        const ref = this.dialog.open(m.EmitirComprobanteDialogComponent, {
          width: '580px', data: venta,
        });
        ref.afterClosed().subscribe((comp: ComprobanteResponse) => {
          if (comp) this.comprobantesMap.set(venta.id, comp);
        });
      });
  }

  metodoPagoClass(m: string): string {
    return { EFECTIVO: 'chip-efectivo', YAPE: 'chip-yape', TARJETA: 'chip-tarjeta', PLIN: 'chip-plin' }[m] ?? '';
  }

  get totalDia(): number { return this.ventas.reduce((s, v) => s + v.total, 0); }

  limpiarFiltros(): void {
    this.cajeroIdFiltro = null;
    this.metodoPagoFiltro = null;
    this.load();
  }
}
