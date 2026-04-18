// src/app/features/comprobantes/comprobantes-list/comprobantes-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog }   from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ComprobanteResponse, TipoComprobante } from '../../../core/models/index';

@Component({
  selector: 'app-comprobantes-list',
  templateUrl: './comprobantes-list.component.html',
  styleUrls: ['./comprobantes-list.component.scss'],
})
export class ComprobantesListComponent implements OnInit {
  comprobantes: ComprobanteResponse[] = [];
  loading = false;

  today = new Date().toISOString().split('T')[0];
  inicio = this.today;
  fin    = this.today;
  tipoFiltro: TipoComprobante | '' = '';

  displayedColumns = ['serie', 'tipo', 'fechaEmision', 'cliente', 'cajero', 'metodoPago', 'total', 'acciones'];

  constructor(
    private comprobanteService: ComprobanteService,
    private router: Router,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.comprobanteService.listarPorFecha(
      this.inicio, this.fin,
      this.tipoFiltro as TipoComprobante || undefined,
    ).subscribe({
      next:  data => { this.comprobantes = data; this.loading = false; },
      error: ()   => { this.loading = false; },
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/comprobantes', id]);
  }

  tipoClass(tipo: string): string {
    return tipo === 'BOLETA' ? 'chip-boleta' : 'chip-factura';
  }

  metodoPagoClass(m: string): string {
    return { EFECTIVO: 'chip-efectivo', YAPE: 'chip-yape', TARJETA: 'chip-tarjeta' }[m] ?? '';
  }

  get totalBoletas():   number { return this.comprobantes.filter(c => c.tipo === 'BOLETA').reduce((s, c)  => s + c.total, 0); }
  get totalFacturas():  number { return this.comprobantes.filter(c => c.tipo === 'FACTURA').reduce((s, c) => s + c.total, 0); }
  get totalGeneral():   number { return this.comprobantes.reduce((s, c) => s + c.total, 0); }
  get cantBoletas():    number { return this.comprobantes.filter(c => c.tipo === 'BOLETA').length; }
  get cantFacturas():   number { return this.comprobantes.filter(c => c.tipo === 'FACTURA').length; }
}
