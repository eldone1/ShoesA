// src/app/core/services/reporte.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
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
  ResumenDiario,
  StockBajo,
} from './index-models';
import { Caja } from './index-models';
import { Venta } from './index-models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private api = `${environment.apiUrl}/reportes`;
  constructor(private http: HttpClient) {}

  ventasPorProducto(inicio: string, fin: string): Observable<ReporteVentaProducto[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteVentaProducto[]>>(`${this.api}/ventas-por-producto`, { params }).pipe(map(r => r.data));
  }

  ventasPorDia(inicio: string, fin: string): Observable<ReporteVentasPorDia[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteVentasPorDia[]>>(`${this.api}/ventas-por-dia`, { params }).pipe(map(r => r.data));
  }

  ventasPorMes(inicio: string, fin: string): Observable<ReporteVentasPorMes[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteVentasPorMes[]>>(`${this.api}/ventas-por-mes`, { params }).pipe(map(r => r.data));
  }

  utilidad(inicio: string, fin: string): Observable<ReporteUtilidad> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteUtilidad>>(`${this.api}/utilidad`, { params }).pipe(map(r => r.data));
  }

  ventasPorTalla(inicio: string, fin: string): Observable<ReporteVentasPorTalla[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteVentasPorTalla[]>>(`${this.api}/ventas-por-talla`, { params }).pipe(map(r => r.data));
  }

  inventarioActual(): Observable<ReporteInventarioActual[]> {
    return this.http.get<ApiResponse<ReporteInventarioActual[]>>(`${this.api}/inventario-actual`).pipe(map(r => r.data));
  }

  productosAgotados(): Observable<ReporteInventarioActual[]> {
    return this.http.get<ApiResponse<ReporteInventarioActual[]>>(`${this.api}/productos-agotados`).pipe(map(r => r.data));
  }

  productosSinRotacion(inicio: string, fin: string): Observable<ReporteProductoSinRotacion[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteProductoSinRotacion[]>>(`${this.api}/productos-sin-rotacion`, { params }).pipe(map(r => r.data));
  }

  ventasPorCajero(inicio: string, fin: string): Observable<ReporteVentasPorCajero[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteVentasPorCajero[]>>(`${this.api}/ventas-por-cajero`, { params }).pipe(map(r => r.data));
  }

  ventasPorCajeroDia(inicio: string, fin: string): Observable<ReporteVentasPorCajeroDia[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteVentasPorCajeroDia[]>>(`${this.api}/ventas-por-cajero-dia`, { params }).pipe(map(r => r.data));
  }

  metodosPago(inicio: string, fin: string): Observable<ReporteMetodoPago[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<ReporteMetodoPago[]>>(`${this.api}/metodos-pago`, { params }).pipe(map(r => r.data));
  }

  resumenDiario(fecha: string): Observable<ResumenDiario> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<ApiResponse<ResumenDiario>>(`${this.api}/resumen-diario`, { params }).pipe(map(r => r.data));
  }
  ventasDelDia(fecha: string): Observable<Venta[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<ApiResponse<Venta[]>>(`${this.api}/ventas-del-dia`, { params }).pipe(map(r => r.data));
  }
  cajasPorRango(inicio: string, fin: string): Observable<Caja[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<Caja[]>>(`${this.api}/cajas`, { params }).pipe(map(r => r.data));
  }
  stockBajo(): Observable<StockBajo[]> {
    return this.http.get<ApiResponse<StockBajo[]>>(`${this.api}/stock-bajo`).pipe(map(r => r.data));
  }

  /* ingresosInventario(desde: string, hasta: string): Observable<IngresoInventario[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<ApiResponse<IngresoInventario[]>>(`${this.api}/ingresos-inventario`, { params })
      .pipe(map(r => r.data));
  } */
}
