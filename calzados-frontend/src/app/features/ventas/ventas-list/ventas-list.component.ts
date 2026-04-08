// src/app/features/ventas/ventas-list/ventas-list.component.ts
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
    return { EFECTIVO: 'chip-efectivo', YAPE: 'chip-yape', TARJETA: 'chip-tarjeta' }[m] ?? '';
  }

  get totalDia(): number { return this.ventas.reduce((s, v) => s + v.total, 0); }
}
