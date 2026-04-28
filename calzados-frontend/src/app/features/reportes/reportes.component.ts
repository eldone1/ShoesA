import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReporteService } from '../../core/services/reporte.service';
import { ExportService } from '../../core/services/export.service';
import { DatePeruService } from '../../core/services/date-peru.service';
import {
  ReporteInventarioActual,
  ReporteMetodoPago,
  ReporteProductoSinRotacion,
  ReporteUtilidad,
  ReporteVentaProducto,
  ReporteVentasPorCajero,
  ReporteVentasPorCajeroDia,
  ReporteVentasPorDia,
  ReporteVentasPorMes,
  ReporteVentasPorTalla,
  StockBajo,
} from '../../core/models/index';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  today = '';
  selectedTabIndex = 0;

  readonly monthOptions = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  readonly yearOptions: number[];

  generalYear = 0;
  generalMonth = 0;

  generalInicio = '';
  generalFin = '';
  ventasMes: ReporteVentasPorMes[] = [];
  ventasDia: ReporteVentasPorDia[] = [];
  utilidad: ReporteUtilidad | null = null;
  loadingGeneral = false;
  exportandoGeneral = false;
  mesExpandido: string | null = null;
  loadingDetalleMes = false;
  detalleMesDias: ReporteVentasPorDia[] = [];
  detalleMesTopProductos: ReporteVentaProducto[] = [];

  prodYear = 0;
  prodMonth = 0;
  prodInicio = '';
  prodFin = '';
  topProductos: ReporteVentaProducto[] = [];
  ventasTalla: ReporteVentasPorTalla[] = [];
  sinRotacion: ReporteProductoSinRotacion[] = [];
  loadingProductos = false;
  exportandoTopProductos = false;
  exportandoProductos = false;

  inventarioActual: ReporteInventarioActual[] = [];
  productosAgotados: ReporteInventarioActual[] = [];
  stockBajo: StockBajo[] = [];
  loadingInventario = false;
  exportandoInventario = false;
  exportandoStockBajo = false;

  finInicio = '';
  finFin = '';
  ventasCajero: ReporteVentasPorCajero[] = [];
  ventasCajeroDia: ReporteVentasPorCajeroDia[] = [];
  metodosPago: ReporteMetodoPago[] = [];
  loadingFinanzas = false;
  exportandoFinanzas = false;

  colsVentasMes = ['periodo', 'cantidadVentas', 'totalVendido'];
  colsVentasDia = ['fecha', 'cantidadVentas', 'totalVendido'];
  colsDetalleMesDias = ['fecha', 'cantidadVentas', 'totalVendido'];
  colsDetalleMesTop = ['pos', 'producto', 'talla', 'color', 'cantidad', 'total'];
  colsTopProductos = ['pos', 'producto', 'talla', 'color', 'cantidad', 'total'];
  colsTallas = ['talla', 'cantidad', 'total'];
  colsSinRotacion = ['producto', 'marca', 'talla', 'color', 'sku', 'stock', 'dias', 'precioCompra'];
  colsInventario = ['producto', 'marca', 'talla', 'color', 'sku', 'stockActual', 'stockMinimo', 'precioCompra', 'precioVenta'];
  colsStockBajo = ['producto', 'marca', 'talla', 'color', 'sku', 'stockActual', 'stockMinimo'];
  colsVentasCajero = ['cajero', 'cantidadVentas', 'totalVendido', 'totalEfectivo', 'totalYape', 'totalTarjeta'];
  colsVentasCajeroDia = ['fecha', 'cajero', 'cantidadVentas', 'totalVendido'];
  colsMetodosPago = ['metodoPago', 'cantidadVentas', 'totalVendido'];

  constructor(
    private reporteService: ReporteService,
    private exportService: ExportService,
    private datePeruService: DatePeruService,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.today = this.datePeruService.getToday();
    const { year, month } = this.datePeruService.getCurrentYearMonth();
    this.yearOptions = this.getYearOptions(year);

    this.generalYear = year;
    this.generalMonth = month;
    this.setPeriodoGeneral(year, month);

    this.prodYear = year;
    this.prodMonth = month;
    this.setPeriodoProductos(year, month);

    this.finInicio = this.getInicioMesActual();
    this.finFin = this.today;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'productos') this.selectedTabIndex = 1;
      else if (tab === 'inventario') this.selectedTabIndex = 2;
      else if (tab === 'finanzas') this.selectedTabIndex = 3;
      else this.selectedTabIndex = 0;
    });

    this.cargarGenerales();
    this.cargarProductos();
    this.cargarInventario();
    this.cargarFinanzas();
  }

  cargarGenerales(): void {
    this.setPeriodoGeneral(this.generalYear, this.generalMonth);
    this.loadingGeneral = true;
    forkJoin({
      ventasMes: this.reporteService.ventasPorMes(this.generalInicio, this.generalFin).pipe(catchError(() => of([]))),
      ventasDia: this.reporteService.ventasPorDia(this.generalInicio, this.generalFin).pipe(catchError(() => of([]))),
      utilidad: this.reporteService.utilidad(this.generalInicio, this.generalFin).pipe(catchError(() => of(null))),
    }).subscribe({
      next: ({ ventasMes, ventasDia, utilidad }) => {
        this.ventasMes = ventasMes;
        this.ventasDia = ventasDia;
        this.utilidad = utilidad;
        this.mesExpandido = null;
        this.detalleMesDias = [];
        this.detalleMesTopProductos = [];
        this.loadingGeneral = false;
      },
      error: () => {
        this.loadingGeneral = false;
      },
    });
  }

  cargarProductos(): void {
    this.setPeriodoProductos(this.prodYear, this.prodMonth);
    this.loadingProductos = true;
    forkJoin({
      top: this.reporteService.ventasPorProducto(this.prodInicio, this.prodFin).pipe(catchError(() => of([]))),
      tallas: this.reporteService.ventasPorTalla(this.prodInicio, this.prodFin).pipe(catchError(() => of([]))),
      sinRotacion: this.reporteService.productosSinRotacion(this.prodInicio, this.prodFin).pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ top, tallas, sinRotacion }) => {
        this.topProductos = top;
        this.ventasTalla = tallas;
        this.sinRotacion = sinRotacion;
        this.loadingProductos = false;
      },
      error: () => {
        this.loadingProductos = false;
      },
    });
  }

  cargarInventario(): void {
    this.loadingInventario = true;
    forkJoin({
      inventario: this.reporteService.inventarioActual().pipe(catchError(() => of([]))),
      agotados: this.reporteService.productosAgotados().pipe(catchError(() => of([]))),
      stockBajo: this.reporteService.stockBajo().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ inventario, agotados, stockBajo }) => {
        this.inventarioActual = inventario;
        this.productosAgotados = agotados;
        this.stockBajo = stockBajo;
        this.loadingInventario = false;
      },
      error: () => {
        this.loadingInventario = false;
      },
    });
  }

  cargarFinanzas(): void {
    this.loadingFinanzas = true;
    forkJoin({
      cajero: this.reporteService.ventasPorCajero(this.finInicio, this.finFin).pipe(catchError(() => of([]))),
      cajeroDia: this.reporteService.ventasPorCajeroDia(this.finInicio, this.finFin).pipe(catchError(() => of([]))),
      metodos: this.reporteService.metodosPago(this.finInicio, this.finFin).pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ cajero, cajeroDia, metodos }) => {
        this.ventasCajero = cajero;
        this.ventasCajeroDia = cajeroDia;
        this.metodosPago = metodos;
        this.loadingFinanzas = false;
      },
      error: () => {
        this.loadingFinanzas = false;
      },
    });
  }

  setRangoHoyFinanzas(): void {
    this.finInicio = this.today;
    this.finFin = this.today;
    this.cargarFinanzas();
  }

  setRangoMesActualFinanzas(): void {
    this.finInicio = this.getInicioMesActual();
    this.finFin = this.today;
    this.cargarFinanzas();
  }

  limpiarGenerales(): void {
    const { year, month } = this.datePeruService.getCurrentYearMonth();
    this.generalYear = year;
    this.generalMonth = month;
    this.setPeriodoGeneral(year, month);
    this.ventasMes = [];
    this.ventasDia = [];
    this.utilidad = null;
    this.mesExpandido = null;
    this.detalleMesDias = [];
    this.detalleMesTopProductos = [];
  }

  limpiarProductos(): void {
    const { year, month } = this.datePeruService.getCurrentYearMonth();
    this.prodYear = year;
    this.prodMonth = month;
    this.setPeriodoProductos(year, month);
    this.topProductos = [];
    this.ventasTalla = [];
    this.sinRotacion = [];
  }

  limpiarFinanzas(): void {
    this.finInicio = this.getInicioMesActual();
    this.finFin = this.today;
    this.ventasCajero = [];
    this.ventasCajeroDia = [];
    this.metodosPago = [];
  }

  toggleDetalleMes(row: ReporteVentasPorMes): void {
    const key = this.getPeriodoKey(row);
    if (this.mesExpandido === key) {
      this.mesExpandido = null;
      this.detalleMesDias = [];
      this.detalleMesTopProductos = [];
      return;
    }

    this.mesExpandido = key;
    this.loadingDetalleMes = true;

    const inicio = `${row.year}-${String(row.month).padStart(2, '0')}-01`;
    const fin = this.getFinMes(row.year, row.month);

    forkJoin({
      dias: this.reporteService.ventasPorDia(inicio, fin).pipe(catchError(() => of([]))),
      top: this.reporteService.ventasPorProducto(inicio, fin).pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ dias, top }) => {
        this.detalleMesDias = dias;
        this.detalleMesTopProductos = top;
        this.loadingDetalleMes = false;
      },
      error: () => {
        this.loadingDetalleMes = false;
      },
    });
  }

  exportarTopProductos(): void {
    if (this.topProductos.length === 0) {
      this.snack.open('Primero genera el reporte de productos', 'OK', { duration: 3000 });
      return;
    }

    this.exportandoTopProductos = true;
    try {
      this.exportService.exportarVentas(this.topProductos, this.prodInicio, this.prodFin);
      this.snack.open('Excel descargado correctamente', 'OK', { duration: 3000, panelClass: 'snack-success' });
    } catch {
      this.snack.open('Error al generar el Excel', 'OK', { duration: 3000, panelClass: 'snack-error' });
    } finally {
      this.exportandoTopProductos = false;
    }
  }

  exportarGeneral(): void {
    if (this.ventasMes.length === 0 && this.ventasDia.length === 0 && !this.utilidad) {
      this.snack.open('Primero genera el reporte general', 'OK', { duration: 3000 });
      return;
    }

    this.exportandoGeneral = true;
    try {
      this.exportService.exportarReporteGeneral(
        this.ventasMes,
        this.ventasDia,
        this.utilidad,
        this.generalInicio,
        this.generalFin,
      );
      this.snack.open('Reporte general descargado', 'OK', { duration: 3000, panelClass: 'snack-success' });
    } catch {
      this.snack.open('Error al generar Excel general', 'OK', { duration: 3000, panelClass: 'snack-error' });
    } finally {
      this.exportandoGeneral = false;
    }
  }

  exportarProductos(): void {
    if (this.topProductos.length === 0 && this.ventasTalla.length === 0 && this.sinRotacion.length === 0) {
      this.snack.open('Primero genera el reporte de productos', 'OK', { duration: 3000 });
      return;
    }

    this.exportandoProductos = true;
    try {
      this.exportService.exportarReporteProductos(
        this.topProductos,
        this.ventasTalla,
        this.sinRotacion,
        this.prodInicio,
        this.prodFin,
      );
      this.snack.open('Reporte de productos descargado', 'OK', { duration: 3000, panelClass: 'snack-success' });
    } catch {
      this.snack.open('Error al generar Excel de productos', 'OK', { duration: 3000, panelClass: 'snack-error' });
    } finally {
      this.exportandoProductos = false;
    }
  }

  exportarInventario(): void {
    if (this.inventarioActual.length === 0 && this.productosAgotados.length === 0 && this.stockBajo.length === 0) {
      this.snack.open('Primero carga el inventario', 'OK', { duration: 3000 });
      return;
    }

    this.exportandoInventario = true;
    try {
      this.exportService.exportarReporteInventario(
        this.inventarioActual,
        this.productosAgotados,
        this.stockBajo,
      );
      this.snack.open('Reporte de inventario descargado', 'OK', { duration: 3000, panelClass: 'snack-success' });
    } catch {
      this.snack.open('Error al generar Excel de inventario', 'OK', { duration: 3000, panelClass: 'snack-error' });
    } finally {
      this.exportandoInventario = false;
    }
  }

  exportarStockBajo(): void {
    if (this.stockBajo.length === 0) {
      this.snack.open('No hay datos de stock bajo para exportar', 'OK', { duration: 3000 });
      return;
    }

    this.exportandoStockBajo = true;
    try {
      this.exportService.exportarReporteInventario([], [], this.stockBajo);
      this.snack.open('Reporte de stock bajo descargado', 'OK', { duration: 3000, panelClass: 'snack-success' });
    } catch {
      this.snack.open('Error al generar Excel de stock bajo', 'OK', { duration: 3000, panelClass: 'snack-error' });
    } finally {
      this.exportandoStockBajo = false;
    }
  }

  exportarFinanzas(): void {
    if (this.ventasCajero.length === 0 && this.ventasCajeroDia.length === 0 && this.metodosPago.length === 0) {
      this.snack.open('Primero genera el reporte de finanzas', 'OK', { duration: 3000 });
      return;
    }

    this.exportandoFinanzas = true;
    try {
      this.exportService.exportarReporteFinanzas(
        this.ventasCajero,
        this.ventasCajeroDia,
        this.metodosPago,
        this.finInicio,
        this.finFin,
      );
      this.snack.open('Reporte de finanzas descargado', 'OK', { duration: 3000, panelClass: 'snack-success' });
    } catch {
      this.snack.open('Error al generar Excel de finanzas', 'OK', { duration: 3000, panelClass: 'snack-error' });
    } finally {
      this.exportandoFinanzas = false;
    }
  }

  get totalGeneralPeriodo(): number {
    return this.ventasDia.reduce((acc, row) => acc + row.totalVendido, 0);
  }

  get totalTopProductos(): number {
    return this.topProductos.reduce((acc, row) => acc + row.totalVendido, 0);
  }

  get totalMetodosPago(): number {
    return this.metodosPago.reduce((acc, row) => acc + row.totalVendido, 0);
  }

  mesLabel(row: ReporteVentasPorMes): string {
    const month = String(row.month).padStart(2, '0');
    return `${row.year}-${month}`;
  }

  get totalDetalleMes(): number {
    return this.detalleMesDias.reduce((acc, row) => acc + row.totalVendido, 0);
  }

  get totalDetalleMesTop(): number {
    return this.detalleMesTopProductos.reduce((acc, row) => acc + row.totalVendido, 0);
  }

  private getPeriodoKey(row: ReporteVentasPorMes): string {
    return `${row.year}-${String(row.month).padStart(2, '0')}`;
  }

  private setPeriodoGeneral(year: number, month: number): void {
    this.generalInicio = `${year}-${String(month).padStart(2, '0')}-01`;
    this.generalFin = this.getFinMes(year, month);
  }

  private setPeriodoProductos(year: number, month: number): void {
    this.prodInicio = `${year}-${String(month).padStart(2, '0')}-01`;
    this.prodFin = this.getFinMes(year, month);
  }

  private getYearOptions(currentYear: number): number[] {
    const startYear = currentYear - 4;
    const endYear = currentYear + 1;
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  }

  private getFinMes(year: number, month: number): string {
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }

  private getInicioMesActual(): string {
    const { year, month } = this.datePeruService.getCurrentYearMonth();
    return `${year}-${String(month).padStart(2, '0')}-01`;
  }
}
