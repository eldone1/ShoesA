// src/app/core/services/marca.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Marca, MarcaRequest } from './index-models';

@Injectable({ providedIn: 'root' })
export class MarcaService {
  private api = `${environment.apiUrl}/marcas`;
  constructor(private http: HttpClient) {}

  listar(): Observable<Marca[]> {
    return this.http.get<ApiResponse<Marca[]>>(this.api).pipe(map(r => r.data));
  }
  listarTodas(): Observable<Marca[]> {
    return this.http.get<ApiResponse<Marca[]>>(`${this.api}/todas`).pipe(map(r => r.data));
  }
  obtener(id: number): Observable<Marca> {
    return this.http.get<ApiResponse<Marca>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }
  crear(body: MarcaRequest): Observable<Marca> {
    return this.http.post<ApiResponse<Marca>>(this.api, body).pipe(map(r => r.data));
  }
  actualizar(id: number, body: MarcaRequest): Observable<Marca> {
    return this.http.put<ApiResponse<Marca>>(`${this.api}/${id}`, body).pipe(map(r => r.data));
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`).pipe(map(() => void 0));
  }
}
