// src/app/core/services/venta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Venta, VentaRequest } from './index-models';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private api = `${environment.apiUrl}/ventas`;
  constructor(private http: HttpClient) {}

  registrar(body: VentaRequest): Observable<Venta> {
    return this.http.post<ApiResponse<Venta>>(this.api, body).pipe(map(r => r.data));
  }
  obtener(id: number): Observable<Venta> {
    return this.http.get<ApiResponse<Venta>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }
  porCaja(cajaId: number): Observable<Venta[]> {
    return this.http.get<ApiResponse<Venta[]>>(`${this.api}/caja/${cajaId}`).pipe(map(r => r.data));
  }
  porFecha(inicio: string, fin: string): Observable<Venta[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<Venta[]>>(`${this.api}/rango`, { params }).pipe(map(r => r.data));
  }
  misVentas(inicio: string, fin: string): Observable<Venta[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<Venta[]>>(`${this.api}/mis-ventas`, { params }).pipe(map(r => r.data));
  }
}
