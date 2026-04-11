// src/app/core/services/export.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Producto } from '../models/index';
import { ReporteVentaProducto } from '../models/index';

@Injectable({ providedIn: 'root' })
export class ExportService {

  // ── Reporte 1: Lista de Productos con stock y detalles ──────────────────
  exportarProductos(productos: Producto[]): void {
    const wb = XLSX.utils.book_new();

    // ── Hoja 1: Resumen por producto ──────────────────────────────────────
    const resumenRows: any[] = [
      ['REPORTE DE PRODUCTOS Y STOCK'],
      [`Generado: ${new Date().toLocaleString('es-PE')}`],
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
      [`Generado: ${new Date().toLocaleString('es-PE')}`],
      [],
      [
        'Producto', 'Marca', 'Talla', 'Color', 'SKU', 'Cód. Barras',
        'P. Compra (S/)', '% Ganancia', 'P. Venta (S/)', 'Stock', 'Stock Mín.', 'Stock Bajo',
      ],
    ];

    productos.forEach(p => {
      (p.variantes || []).forEach(v => {
        detalleRows.push([
          p.nombre,
          p.marca?.nombre ?? 'Sin marca',
          v.talla,
          v.color,
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
      { wch: 28 }, { wch: 15 }, { wch: 8 }, { wch: 10 }, { wch: 18 }, { wch: 18 },
      { wch: 14 }, { wch: 12 }, { wch: 13 }, { wch: 8 }, { wch: 10 }, { wch: 11 },
    ];
    XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Variantes');

    const fecha = new Date().toISOString().split('T')[0];
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
      [`Generado: ${new Date().toLocaleString('es-PE')}`],
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
      [`Generado: ${new Date().toLocaleString('es-PE')}`],
      [],
      ['Métrica', 'Valor'],
      ['Total productos distintos vendidos', ventas.length],
      ['Total unidades vendidas', totalUnidades],
      ['Total facturado (S/)', totalGeneral],
    ];

    const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
    wsResumen['!cols'] = [{ wch: 35 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

    const fecha = new Date().toISOString().split('T')[0];
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
    ['A4','B4','C4','D4','E4','F4','G4','H4','I4','J4','K4','L4'].forEach(cell => {
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