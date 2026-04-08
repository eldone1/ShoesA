// src/app/core/services/reporte.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ReporteVentaProducto, ResumenDiario, StockBajo } from './index-models';
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
}
