// src/app/features/ventas/ventas-list/ventas-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VentaService }          from '../../../core/services/venta.service';
import { ComprobanteService }      from '../../../core/services/comprobante.service';
import { MatDialog }               from '@angular/material/dialog';
import { AuthService }       from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { DatePeruService } from '../../../core/services/date-peru.service';
import { ExportService } from '../../../core/services/export.service';
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

  inicio = '';
  fin    = '';
  cajeros: User[] = [];
  cajeroIdFiltro: number | null = null;
  metodoPagoFiltro: MetodoPago | null = null;
  readonly metodosPago: MetodoPago[] = ['EFECTIVO', 'YAPE', 'TARJETA'];

  page = 0;
  pageSize = 25;
  totalElements = 0;

  displayedColumns = ['id', 'fecha', 'cajero', 'items', 'metodoPago', 'total', 'comprobante', 'acciones'];
  expandedVenta: Venta | null = null;
  comprobantesMap: Map<number, ComprobanteResponse> = new Map();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private ventaService: VentaService,
    private authService: AuthService,
    private userService: UserService,
    private comprobanteService: ComprobanteService,
    private datePeruService: DatePeruService,
    private exportService: ExportService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.isAdmin = authService.isAdmin();
    this.inicio = this.datePeruService.getToday();
    this.fin = this.inicio;
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
    this.page = 0;

    if (this.cajaId) {
      this.ventaService.porCaja(this.cajaId).subscribe({
        next:  data => { this.ventas = data; this.totalElements = data.length; this.loading = false; },
        error: ()   => { this.loading = false; },
      });
    } else if (this.isAdmin) {
      this.ventaService.porFechaFiltrada(this.inicio, this.fin, this.cajeroIdFiltro, this.metodoPagoFiltro, this.page, this.pageSize).subscribe({
        next:  p => { this.ventas = p.content; this.totalElements = p.totalElements; this.loading = false; },
        error: () => { this.loading = false; },
      });
    } else {
      this.ventaService.misVentas(this.inicio, this.fin, this.page, this.pageSize).subscribe({
        next:  p => { this.ventas = p.content; this.totalElements = p.totalElements; this.loading = false; },
        error: () => { this.loading = false; },
      });
    }
  }

  onPageChange(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loading = true;

    if (this.isAdmin) {
      this.ventaService.porFechaFiltrada(this.inicio, this.fin, this.cajeroIdFiltro, this.metodoPagoFiltro, this.page, this.pageSize).subscribe({
        next:  p => { this.ventas = p.content; this.totalElements = p.totalElements; this.loading = false; },
        error: () => { this.loading = false; },
      });
    } else {
      this.ventaService.misVentas(this.inicio, this.fin, this.page, this.pageSize).subscribe({
        next:  p => { this.ventas = p.content; this.totalElements = p.totalElements; this.loading = false; },
        error: () => { this.loading = false; },
      });
    }
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

  exportarVentasExcel(): void {
    const nombreCajero = this.cajeroIdFiltro
      ? this.cajeros.find(c => c.id === this.cajeroIdFiltro)?.nombre
      : undefined;

    this.exportService.exportarVentasListado(
      this.ventas,
      this.inicio,
      this.fin,
      nombreCajero,
      this.metodoPagoFiltro ?? undefined,
    );
  }
}
