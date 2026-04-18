// src/app/core/services/comprobante.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ComprobanteRequest, ComprobanteResponse, TipoComprobante } from '../models/index';

@Injectable({ providedIn: 'root' })
export class ComprobanteService {
  private api = `${environment.apiUrl}/comprobantes`;
  constructor(private http: HttpClient) {}

  emitir(body: ComprobanteRequest): Observable<ComprobanteResponse> {
    return this.http.post<ApiResponse<ComprobanteResponse>>(this.api, body).pipe(map(r => r.data));
  }

  obtener(id: number): Observable<ComprobanteResponse> {
    return this.http.get<ApiResponse<ComprobanteResponse>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }

  obtenerPorSerie(serie: string): Observable<ComprobanteResponse> {
    return this.http.get<ApiResponse<ComprobanteResponse>>(`${this.api}/serie/${serie}`).pipe(map(r => r.data));
  }

  obtenerPorVenta(ventaId: number): Observable<ComprobanteResponse> {
    return this.http.get<ApiResponse<ComprobanteResponse>>(`${this.api}/venta/${ventaId}`).pipe(map(r => r.data));
  }

  listarPorFecha(inicio: string, fin: string, tipo?: TipoComprobante): Observable<ComprobanteResponse[]> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    if (tipo) params = params.set('tipo', tipo);
    return this.http.get<ApiResponse<ComprobanteResponse[]>>(this.api, { params }).pipe(map(r => r.data));
  }

  listarPorCliente(clienteId: number): Observable<ComprobanteResponse[]> {
    return this.http.get<ApiResponse<ComprobanteResponse[]>>(`${this.api}/cliente/${clienteId}`)
      .pipe(map(r => r.data));
  }
}
