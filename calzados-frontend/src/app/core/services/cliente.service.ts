// src/app/core/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Cliente, ClienteRequest } from '../models/index';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private api = `${environment.apiUrl}/clientes`;
  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http.get<ApiResponse<Cliente[]>>(this.api).pipe(map(r => r.data));
  }

  buscar(q: string): Observable<Cliente[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<ApiResponse<Cliente[]>>(this.api, { params }).pipe(map(r => r.data));
  }

  obtener(id: number): Observable<Cliente> {
    return this.http.get<ApiResponse<Cliente>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }

  obtenerPorDni(dni: string): Observable<Cliente> {
    return this.http.get<ApiResponse<Cliente>>(`${this.api}/dni/${dni}`).pipe(map(r => r.data));
  }

  crear(body: ClienteRequest): Observable<Cliente> {
    return this.http.post<ApiResponse<Cliente>>(this.api, body).pipe(map(r => r.data));
  }

  actualizar(id: number, body: ClienteRequest): Observable<Cliente> {
    return this.http.put<ApiResponse<Cliente>>(`${this.api}/${id}`, body).pipe(map(r => r.data));
  }

  cambiarEstado(id: number, activo: boolean): Observable<void> {
    const params = new HttpParams().set('activo', activo.toString());
    return this.http.patch<ApiResponse<void>>(`${this.api}/${id}/estado`, null, { params })
      .pipe(map(() => void 0));
  }
}
