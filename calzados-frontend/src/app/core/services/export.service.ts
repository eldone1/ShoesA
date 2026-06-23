// src/app/core/services/export.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {
  Producto,
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
  SolicitudCompra,
  Gasto,
  Venta,
} from '../models/index';
import { DatePeruService } from './date-peru.service';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(private datePeruService: DatePeruService) {}

  exportarReporteGeneral(
    ventasMes: ReporteVentasPorMes[],
    ventasDia: ReporteVentasPorDia[],
    utilidad: ReporteUtilidad | null,
    inicio: string,
    fin: string,
  ): void {
    const wb = XLSX.utils.book_new();

    const resumenRows: any[] = [
      ['REPORTE GENERAL DE VENTAS'],
      [`Periodo: ${inicio} -> ${fin}`],
      [`Generado: ${this.datePeruService.toLocaleString()}`],
      [],
      ['Indicador', 'Valor'],
      ['Total vendido', utilidad?.totalVendido ?? 0],
      ['Total costo', utilidad?.totalCosto ?? 0],
      ['Total gastos', utilidad?.totalGastos ?? 0],
      ['Ganancia bruta', utilidad?.gananciaBruta ?? 0],
      ['Ganancia real', utilidad?.gananciaReal ?? 0],
      ['Margen bruto (%)', utilidad?.margenBruto ?? 0],
      ['Margen real (%)', utilidad?.margenReal ?? 0],
    ];

    const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
    wsResumen['!cols'] = [{ wch: 28 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen General');

    const ventasMesRows: any[] = [
      ['VENTAS POR MES'],
      [`Periodo: ${inicio} -> ${fin}`],
      [],
      ['Ano', 'Mes', 'Ventas', 'Total Vendido (S/)'],
      ...ventasMes.map(v => [v.year, v.month, v.cantidadVentas, v.totalVendido]),
    ];
    const wsMes = XLSX.utils.aoa_to_sheet(ventasMesRows);
    wsMes['!cols'] = [{ wch: 10 }, { wch: 8 }, { wch: 12 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsMes, 'Ventas por Mes');

    const ventasDiaRows: any[] = [
      ['VENTAS POR DIA'],
      [`Periodo: ${inicio} -> ${fin}`],
      [],
      ['Fecha', 'Ventas', 'Total Vendido (S/)'],
      ...ventasDia.map(v => [v.fecha, v.cantidadVentas, v.totalVendido]),
    ];
    const wsDia = XLSX.utils.aoa_to_sheet(ventasDiaRows);
    wsDia['!cols'] = [{ wch: 14 }, { wch: 12 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsDia, 'Ventas por Dia');

    XLSX.writeFile(wb, `reporte_general_${inicio}_${fin}.xlsx`);
  }

  exportarReporteProductos(
    topProductos: ReporteVentaProducto[],
    ventasTalla: ReporteVentasPorTalla[],
    sinRotacion: ReporteProductoSinRotacion[],
    inicio: string,
    fin: string,
  ): void {
    const wb = XLSX.utils.book_new();

    const topRows: any[] = [
      ['PRODUCTOS MAS VENDIDOS'],
      [`Periodo: ${inicio} -> ${fin}`],
      [`Generado: ${this.datePeruService.toLocaleString()}`],
      [],
      ['#', 'Producto', 'Talla', 'Color', 'Unidades', 'Total Vendido (S/)'],
      ...topProductos.map((v, i) => [i + 1, v.productoNombre, v.talla, v.color, v.cantidadVendida, v.totalVendido]),
    ];
    const wsTop = XLSX.utils.aoa_to_sheet(topRows);
    wsTop['!cols'] = [{ wch: 5 }, { wch: 28 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsTop, 'Top Productos');

    const tallasRows: any[] = [
      ['VENTAS POR TALLA'],
      [`Periodo: ${inicio} -> ${fin}`],
      [],
      ['Talla', 'Unidades', 'Total Vendido (S/)'],
      ...ventasTalla.map(v => [v.talla, v.cantidadVendida, v.totalVendido]),
    ];
    const wsTallas = XLSX.utils.aoa_to_sheet(tallasRows);
    wsTallas['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsTallas, 'Ventas por Talla');

    const sinRotRows: any[] = [
      ['PRODUCTOS SIN ROTACION'],
      [`Periodo: ${inicio} -> ${fin}`],
      [],
      ['Producto', 'Marca', 'Talla', 'Color', 'SKU', 'Stock', 'Dias sin venta', 'P. Compra'],
      ...sinRotacion.map(v => [
        v.productoNombre,
        v.marcaNombre,
        v.talla,
        v.color,
        v.sku,
        v.stockActual,
        v.diasSinVenta ?? 'N/A',
        v.precioCompra,
      ]),
    ];
    const wsSinRot = XLSX.utils.aoa_to_sheet(sinRotRows);
    wsSinRot['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 14 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsSinRot, 'Sin Rotacion');

    XLSX.writeFile(wb, `reporte_productos_${inicio}_${fin}.xlsx`);
  }

  exportarReporteInventario(
    inventarioActual: ReporteInventarioActual[],
    agotados: ReporteInventarioActual[],
    stockBajo: StockBajo[],
  ): void {
    const wb = XLSX.utils.book_new();
    const generado = this.datePeruService.toLocaleString();

    const inventarioRows: any[] = [
      ['INVENTARIO ACTUAL'],
      [`Generado: ${generado}`],
      [],
      ['Producto', 'Marca', 'Talla', 'Color', 'SKU', 'Stock Actual', 'Stock Minimo', 'P. Compra', 'P. Venta'],
      ...inventarioActual.map(v => [
        v.productoNombre,
        v.marcaNombre,
        v.talla,
        v.color,
        v.sku,
        v.stockActual,
        v.stockMinimo,
        v.precioCompra,
        v.precioVenta,
      ]),
    ];
    const wsInv = XLSX.utils.aoa_to_sheet(inventarioRows);
    wsInv['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsInv, 'Inventario');

    const agotadosRows: any[] = [
      ['PRODUCTOS AGOTADOS'],
      [`Generado: ${generado}`],
      [],
      ['Producto', 'Marca', 'Talla', 'Color', 'SKU', 'Stock Actual', 'Stock Minimo'],
      ...agotados.map(v => [v.productoNombre, v.marcaNombre, v.talla, v.color, v.sku, v.stockActual, v.stockMinimo]),
    ];
    const wsAgotados = XLSX.utils.aoa_to_sheet(agotadosRows);
    wsAgotados['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsAgotados, 'Agotados');

    const stockBajoRows: any[] = [
      ['PRODUCTOS BAJO STOCK'],
      [`Generado: ${generado}`],
      [],
      ['Producto', 'Marca', 'Talla', 'Color', 'SKU', 'Stock Actual', 'Stock Minimo'],
      ...stockBajo.map(v => [v.productoNombre, v.marcaNombre, v.talla, v.color, v.sku, v.stockActual, v.stockMinimo]),
    ];
    const wsStockBajo = XLSX.utils.aoa_to_sheet(stockBajoRows);
    wsStockBajo['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsStockBajo, 'Stock Bajo');

    const fecha = this.datePeruService.getToday();
    XLSX.writeFile(wb, `reporte_inventario_${fecha}.xlsx`);
  }

  exportarReporteFinanzas(
    ventasCajero: ReporteVentasPorCajero[],
    ventasCajeroDia: ReporteVentasPorCajeroDia[],
    metodosPago: ReporteMetodoPago[],
    inicio: string,
    fin: string,
  ): void {
    const wb = XLSX.utils.book_new();

    const cajeroRows: any[] = [
      ['VENTAS POR CAJERO'],
      [`Periodo: ${inicio} -> ${fin}`],
      [`Generado: ${this.datePeruService.toLocaleString()}`],
      [],
      ['Cajero', 'Ventas', 'Total Vendido', 'Efectivo', 'Yape', 'Tarjeta'],
      ...ventasCajero.map(v => [v.cajeroNombre, v.cantidadVentas, v.totalVendido, v.totalEfectivo, v.totalYape, v.totalTarjeta]),
    ];
    const wsCajero = XLSX.utils.aoa_to_sheet(cajeroRows);
    wsCajero['!cols'] = [{ wch: 24 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsCajero, 'Ventas por Cajero');

    const cajeroDiaRows: any[] = [
      ['CAJERO POR DIAS'],
      [`Periodo: ${inicio} -> ${fin}`],
      [],
      ['Fecha', 'Cajero', 'Ventas', 'Total Vendido'],
      ...ventasCajeroDia.map(v => [v.fecha, v.cajeroNombre, v.cantidadVentas, v.totalVendido]),
    ];
    const wsCajeroDia = XLSX.utils.aoa_to_sheet(cajeroDiaRows);
    wsCajeroDia['!cols'] = [{ wch: 14 }, { wch: 24 }, { wch: 10 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsCajeroDia, 'Cajero por Dia');

    const metodoRows: any[] = [
      ['METODOS DE PAGO'],
      [`Periodo: ${inicio} -> ${fin}`],
      [],
      ['Metodo', 'Cantidad Ventas', 'Total Vendido'],
      ...metodosPago.map(v => [v.metodoPago, v.cantidadVentas, v.totalVendido]),
    ];
    const wsMetodos = XLSX.utils.aoa_to_sheet(metodoRows);
    wsMetodos['!cols'] = [{ wch: 16 }, { wch: 16 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsMetodos, 'Metodos Pago');

    XLSX.writeFile(wb, `reporte_finanzas_${inicio}_${fin}.xlsx`);
  }

  exportarVentasListado(
    ventas: Venta[],
    inicio: string,
    fin: string,
    cajeroFiltro?: string,
    metodoFiltro?: string,
  ): void {
    const wb = XLSX.utils.book_new();
    const total = ventas.reduce((sum, v) => sum + (v.total ?? 0), 0);

    const resumenRows: any[] = [
      ['REPORTE DE VENTAS'],
      [`Periodo: ${inicio} -> ${fin}`],
      [`Cajero: ${cajeroFiltro ?? 'Todos'}`],
      [`Metodo pago: ${metodoFiltro ?? 'Todos'}`],
      [`Generado: ${this.datePeruService.toLocaleString()}`],
      [],
      ['#', 'Fecha', 'Cajero', 'Metodo pago', 'Items', 'Subtotal', 'Descuento', 'Total', 'Recibido', 'Vuelto'],
      ...ventas.map(v => [
        v.id,
        v.fecha,
        v.cajero?.nombre ?? '',
        v.metodoPago,
        v.detalles?.length ?? 0,
        v.subtotal,
        v.descuento,
        v.total,
        v.montoRecibido ?? '',
        v.vuelto,
      ]),
      [],
      ['', '', '', '', '', '', 'TOTAL', total, '', ''],
    ];
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
    wsResumen['!cols'] = [{ wch: 8 }, { wch: 20 }, { wch: 24 }, { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Ventas');

    const detalleRows: any[] = [
      ['DETALLE DE VENTAS'],
      [`Periodo: ${inicio} -> ${fin}`],
      [],
      ['Venta #', 'Fecha', 'Cajero', 'Producto', 'Talla', 'Color', 'SKU', 'Cantidad', 'P. Unit.', 'Desc. Item', 'Subtotal'],
    ];

    ventas.forEach(v => {
      (v.detalles ?? []).forEach(d => {
        detalleRows.push([
          v.id,
          v.fecha,
          v.cajero?.nombre ?? '',
          d.productoNombre,
          d.talla,
          d.color,
          d.sku,
          d.cantidad,
          d.precioUnitario,
          d.descuentoItem,
          d.subtotal,
        ]);
      });
    });

    const wsDetalle = XLSX.utils.aoa_to_sheet(detalleRows);
    wsDetalle['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 22 }, { wch: 28 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle');

    XLSX.writeFile(wb, `ventas_${inicio}_${fin}.xlsx`);
  }

  exportarSolicitudCompra(solicitud: SolicitudCompra): void {
    const wb = XLSX.utils.book_new();
    const generado = this.datePeruService.toLocaleString();

    const resumenRows: any[] = [
      ['SOLICITUD DE COMPRA'],
      [`Código: ${solicitud.codigo}`],
      [`Proveedor: ${solicitud.proveedor.nombre}`],
      [`RUC: ${solicitud.proveedor.ruc}`],
      [`Estado: ${solicitud.estado}`],
      [`Condición de pago: ${solicitud.condicionPago}`],
      [`Fecha solicitud: ${solicitud.fechaSolicitud}`],
      [`Fecha vencimiento: ${solicitud.fechaVencimiento ?? '-'}`],
      [`Total: S/ ${solicitud.total.toFixed(2)}`],
      [`Generado: ${generado}`],
      [],
      ['Producto', 'Variante', 'Solicitado', 'Recibido', 'Pendiente', 'P. Unitario', 'Subtotal'],
      ...solicitud.detalles.map(d => [
        d.productoNombre,
        `${d.varianteSku} · ${d.varianteTalla}/${d.varianteColor}`,
        d.cantidadSolicitada,
        d.cantidadRecibida,
        d.cantidadPendiente,
        d.precioUnitario,
        d.subtotal,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(resumenRows);
    ws['!cols'] = [
      { wch: 28 },
      { wch: 28 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitud');

    XLSX.writeFile(wb, `${solicitud.codigo}.xlsx`);
  }

  exportarGastos(gastos: Gasto[], year: number, month: number): void {
    const wb = XLSX.utils.book_new();
    const generado = this.datePeruService.toLocaleString();
    const totalGastos = gastos.reduce((sum, g) => sum + (g.monto ?? 0), 0);

    const resumenRows: any[] = [
      ['REPORTE DE GASTOS'],
      [`Mes: ${new Date(year, month - 1, 1).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}`],
      [`Generado: ${generado}`],
      [],
      ['Fecha', 'Tipo', 'Concepto', 'Descripción', 'Monto', 'Registrado por'],
      ...gastos.map(g => [
        g.fechaGasto,
        g.tipo,
        g.concepto,
        g.descripcion ?? '-',
        g.monto,
        g.usuarioNombre,
      ]),
      [],
      ['', '', '', 'TOTAL', totalGastos, ''],
    ];

    const ws = XLSX.utils.aoa_to_sheet(resumenRows);
    ws['!cols'] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 30 },
      { wch: 30 },
      { wch: 12 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Gastos');

    const fecha = this.datePeruService.getToday();
    XLSX.writeFile(wb, `gastos_${year}_${String(month).padStart(2, '0')}_${fecha}.xlsx`);
  }
  exportarProductos(productos: Producto[]): void {
    const wb = XLSX.utils.book_new();

    // ── Hoja 1: Resumen por producto ──────────────────────────────────────
    const resumenRows: any[] = [
      ['REPORTE DE PRODUCTOS Y STOCK'],
      [`Generado: ${this.datePeruService.toLocaleString()}`],
      [],
      ['#', 'Producto', 'Marca', 'Descripción', 'Estado', 'Total Variantes', 'Stock Total'],
    ];

    productos.forEach((p, i) => {
      const stockTotal = (p.variantes || []).reduce((s, v) => s + (v.stock ?? 0), 0);
      resumenRows.push([
        i + 1,
        p.nombre,
        p.marca?.nombre ?? 'Sin marca',
        p.descripcion ?? '',
        p.activo ? 'Activo' : 'Inactivo',
        (p.variantes || []).length,
        stockTotal,
      ]);
    });

    const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
    this.aplicarEstilosProductos(wsResumen, resumenRows.length);
    wsResumen['!cols'] = [
      { wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 30 },
      { wch: 10 }, { wch: 16 }, { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

    // ── Hoja 2: Detalle de variantes ──────────────────────────────────────
    const detalleRows: any[] = [
      ['DETALLE DE VARIANTES POR PRODUCTO'],
      [`Generado: ${this.datePeruService.toLocaleString()}`],
      [],
      [
        'Producto', 'Marca', 'Descripción', 'Talla', 'Color', 'Ubicación',
        'SKU', 'Cód. Barras', 'P. Compra (S/)', '% Ganancia', 'P. Venta (S/)',
        'Stock', 'Stock Mín.', 'Stock Bajo',
      ],
    ];

    productos.forEach(p => {
      (p.variantes || []).forEach(v => {
        detalleRows.push([
          p.nombre,
          p.marca?.nombre ?? 'Sin marca',
          p.descripcion ?? '',
          v.talla,
          v.color,
          v.ubicacion ?? '',
          v.sku,
          v.codigoBarras,
          v.precioCompra,
          v.porcentajeGanancia,
          v.precioVenta,
          v.stock,
          v.stockMinimo,
          v.stockBajo ? 'SÍ' : 'NO',
        ]);
      });
    });

    const wsDetalle = XLSX.utils.aoa_to_sheet(detalleRows);
    this.aplicarEstilosDetalle(wsDetalle, detalleRows.length);
    wsDetalle['!cols'] = [
      { wch: 28 }, { wch: 15 }, { wch: 30 }, { wch: 8 }, { wch: 10 },
      { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 12 },
      { wch: 13 }, { wch: 8 }, { wch: 10 }, { wch: 11 },
    ];
    XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Variantes');

    const fecha = this.datePeruService.getToday();
    XLSX.writeFile(wb, `reporte_productos_${fecha}.xlsx`);
  }

  // ── Reporte 2: Ventas por producto con rango de fechas ──────────────────
  exportarVentas(
    ventas: ReporteVentaProducto[],
    inicio: string,
    fin: string,
  ): void {
    const wb = XLSX.utils.book_new();
    const totalGeneral = ventas.reduce((s, v) => s + v.totalVendido, 0);
    const totalUnidades = ventas.reduce((s, v) => s + v.cantidadVendida, 0);

    // ── Hoja 1: Ventas por producto ───────────────────────────────────────
    const rows: any[] = [
      ['REPORTE DE VENTAS POR PRODUCTO'],
      [`Período: ${inicio}  →  ${fin}`],
      [`Generado: ${this.datePeruService.toLocaleString()}`],
      [],
      ['#', 'Producto', 'Talla', 'Color', 'Uds. Vendidas', 'Total Vendido (S/)'],
    ];

    ventas.forEach((v, i) => {
      rows.push([
        i + 1,
        v.productoNombre,
        v.talla,
        v.color,
        v.cantidadVendida,
        v.totalVendido,
      ]);
    });

    // Fila de totales
    rows.push([]);
    rows.push(['', '', '', 'TOTALES', totalUnidades, totalGeneral]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    this.aplicarEstilosVentas(ws, rows.length);
    ws['!cols'] = [
      { wch: 5 }, { wch: 32 }, { wch: 8 }, { wch: 10 },
      { wch: 14 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas por Producto');

    // ── Hoja 2: Resumen ───────────────────────────────────────────────────
    const resumenRows: any[] = [
      ['RESUMEN DEL PERÍODO'],
      [`Desde: ${inicio}`],
      [`Hasta: ${fin}`],
      [`Generado: ${this.datePeruService.toLocaleString()}`],
      [],
      ['Métrica', 'Valor'],
      ['Total productos distintos vendidos', ventas.length],
      ['Total unidades vendidas', totalUnidades],
      ['Total facturado (S/)', totalGeneral],
    ];

    const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
    wsResumen['!cols'] = [{ wch: 35 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

    const fecha = this.datePeruService.getToday();
    XLSX.writeFile(wb, `reporte_ventas_${inicio}_${fin}.xlsx`);
  }

  // ── Helpers de estilo ────────────────────────────────────────────────────
  private aplicarEstilosProductos(ws: XLSX.WorkSheet, totalRows: number): void {
    // Título
    if (ws['A1']) ws['A1'].s = { font: { bold: true, sz: 14 }, fill: { fgColor: { rgb: '1565C0' } }, font2: { color: { rgb: 'FFFFFF' } } };
    // Cabecera (fila 4)
    ['A4','B4','C4','D4','E4','F4','G4'].forEach(cell => {
      if (ws[cell]) ws[cell].s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1976D2' } }, alignment: { horizontal: 'center' } };
    });
  }

  private aplicarEstilosDetalle(ws: XLSX.WorkSheet, totalRows: number): void {
    if (ws['A1']) ws['A1'].s = { font: { bold: true, sz: 14 } };
    ['A4','B4','C4','D4','E4','F4','G4','H4','I4','J4','K4','L4','M4','N4'].forEach(cell => {
      if (ws[cell]) ws[cell].s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '00695C' } }, alignment: { horizontal: 'center' } };
    });
  }

  private aplicarEstilosVentas(ws: XLSX.WorkSheet, totalRows: number): void {
    if (ws['A1']) ws['A1'].s = { font: { bold: true, sz: 14 } };
    ['A5','B5','C5','D5','E5','F5'].forEach(cell => {
      if (ws[cell]) ws[cell].s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '4527A0' } }, alignment: { horizontal: 'center' } };
    });
  }
}