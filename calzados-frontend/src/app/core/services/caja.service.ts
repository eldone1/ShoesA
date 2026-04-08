// src/app/core/services/caja.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Caja, AperturaCajaRequest, CierreCajaRequest } from './index-models';

@Injectable({ providedIn: 'root' })
export class CajaService {
  private api = `${environment.apiUrl}/cajas`;
  constructor(private http: HttpClient) {}

  abrir(body: AperturaCajaRequest): Observable<Caja> {
    return this.http.post<ApiResponse<Caja>>(`${this.api}/abrir`, body).pipe(map(r => r.data));
  }
  cerrar(id: number, body: CierreCajaRequest): Observable<Caja> {
    return this.http.post<ApiResponse<Caja>>(`${this.api}/${id}/cerrar`, body).pipe(map(r => r.data));
  }
  miCaja(): Observable<Caja> {
    return this.http.get<ApiResponse<Caja>>(`${this.api}/mi-caja`).pipe(map(r => r.data));
  }
  obtener(id: number): Observable<Caja> {
    return this.http.get<ApiResponse<Caja>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }
  listar(): Observable<Caja[]> {
    return this.http.get<ApiResponse<Caja[]>>(this.api).pipe(map(r => r.data));
  }
  listarPorFecha(inicio: string, fin: string): Observable<Caja[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ApiResponse<Caja[]>>(`${this.api}/rango`, { params }).pipe(map(r => r.data));
  }
}
