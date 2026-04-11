// src/app/features/reportes/reportes.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSnackBar }       from '@angular/material/snack-bar';
import { ReporteService }    from '../../core/services/reporte.service';
import { ExportService }     from '../../core/services/export.service';
import { ResumenDiario, ReporteVentaProducto, StockBajo } from '../../core/models/index';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  today = new Date().toISOString().split('T')[0];

  // Resumen diario
  fechaResumen = this.today;
  resumen: ResumenDiario | null = null;
  loadingResumen = false;

  // Ventas por producto
  inicioProd = this.today;
  finProd     = this.today;
  ventasProd: ReporteVentaProducto[] = [];
  loadingProd = false;
  exportandoVentas = false;
  colsProd = ['pos', 'producto', 'talla', 'color', 'cantidad', 'total'];

  // Stock bajo
  stockBajo: StockBajo[] = [];
  loadingStock = false;
  colsStock = ['producto', 'marca', 'talla', 'color', 'sku', 'stockActual', 'stockMinimo'];

  constructor(private reporteService: ReporteService,
    private exportService: ExportService,
    private snack: MatSnackBar,) {}

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarStockBajo();
  }

  cargarResumen(): void {
    this.loadingResumen = true;
    this.reporteService.resumenDiario(this.fechaResumen).subscribe({
      next:  r => { this.resumen = r; this.loadingResumen = false; },
      error: () => { this.loadingResumen = false; },
    });
  }

  cargarVentasPorProducto(): void {
    this.loadingProd = true;
    this.reporteService.ventasPorProducto(this.inicioProd, this.finProd).subscribe({
      next:  r => { this.ventasProd = r; this.loadingProd = false; },
      error: () => { this.loadingProd = false; },
    });
  }

  cargarStockBajo(): void {
    this.loadingStock = true;
    this.reporteService.stockBajo().subscribe({
      next:  r => { this.stockBajo = r; this.loadingStock = false; },
      error: () => { this.loadingStock = false; },
    });
  }

  get totalVendido(): number { return this.ventasProd.reduce((s, v) => s + v.totalVendido, 0); }

   // ── Exportar ventas ───────────────────────────────────────────────────────
  exportarVentas(): void {
    if (this.ventasProd.length === 0) {
      this.snack.open('Primero genera el reporte antes de exportar', 'OK', { duration: 3000 });
      return;
    }
    this.exportandoVentas = true;
    try {
      this.exportService.exportarVentas(this.ventasProd, this.inicioProd, this.finProd);
      this.snack.open('Excel descargado correctamente', 'OK', { duration: 3000, panelClass: 'snack-success' });
    } catch (e) {
      this.snack.open('Error al generar el Excel', 'OK', { duration: 3000, panelClass: 'snack-error' });
    } finally {
      this.exportandoVentas = false;
    }
  }
}
