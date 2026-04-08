// src/app/core/services/producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Producto, ProductoRequest, Variante, VarianteRequest, StockBajo } from './index-models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private api = `${environment.apiUrl}/productos`;
  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<ApiResponse<Producto[]>>(this.api).pipe(map(r => r.data));
  }
  buscar(nombre?: string, marcaId?: number): Observable<Producto[]> {
    let params = new HttpParams();
    if (nombre)  params = params.set('nombre', nombre);
    if (marcaId) params = params.set('marcaId', marcaId.toString());
    return this.http.get<ApiResponse<Producto[]>>(this.api, { params }).pipe(map(r => r.data));
  }
  obtener(id: number): Observable<Producto> {
    return this.http.get<ApiResponse<Producto>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }
  crear(body: ProductoRequest): Observable<Producto> {
    return this.http.post<ApiResponse<Producto>>(this.api, body).pipe(map(r => r.data));
  }
  actualizar(id: number, body: ProductoRequest): Observable<Producto> {
    return this.http.put<ApiResponse<Producto>>(`${this.api}/${id}`, body).pipe(map(r => r.data));
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`).pipe(map(() => void 0));
  }
  scanearCodigoBarras(codigo: string): Observable<Variante> {
    return this.http.get<ApiResponse<Variante>>(`${this.api}/scan/${codigo}`).pipe(map(r => r.data));
  }
  stockBajo(): Observable<Variante[]> {
    return this.http.get<ApiResponse<Variante[]>>(`${this.api}/stock-bajo`).pipe(map(r => r.data));
  }
  // Variantes
  agregarVariante(productoId: number, body: VarianteRequest): Observable<Variante> {
    return this.http.post<ApiResponse<Variante>>(`${this.api}/${productoId}/variantes`, body).pipe(map(r => r.data));
  }
  actualizarVariante(productoId: number, varianteId: number, body: VarianteRequest): Observable<Variante> {
    return this.http.put<ApiResponse<Variante>>(`${this.api}/${productoId}/variantes/${varianteId}`, body).pipe(map(r => r.data));
  }
  eliminarVariante(productoId: number, varianteId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${productoId}/variantes/${varianteId}`).pipe(map(() => void 0));
  }
}
