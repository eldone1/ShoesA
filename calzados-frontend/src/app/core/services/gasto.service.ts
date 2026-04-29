import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Gasto, GastoRequest, ResumenGastosMes } from '../models/index';

@Injectable({ providedIn: 'root' })
export class GastoService {
  private api = `${environment.apiUrl}/gastos`;

  constructor(private http: HttpClient) {}

  listarMes(year: number, month: number): Observable<Gasto[]> {
    const params = new HttpParams().set('year', year.toString()).set('month', month.toString());
    return this.http.get<ApiResponse<Gasto[]>>(this.api, { params }).pipe(map(r => r.data));
  }

  resumenMes(year: number, month: number): Observable<ResumenGastosMes> {
    const params = new HttpParams().set('year', year.toString()).set('month', month.toString());
    return this.http.get<ApiResponse<ResumenGastosMes>>(`${this.api}/resumen-mes`, { params }).pipe(map(r => r.data));
  }

  crear(body: GastoRequest): Observable<Gasto> {
    return this.http.post<ApiResponse<Gasto>>(this.api, body).pipe(map(r => r.data));
  }

  obtener(id: number): Observable<Gasto> {
    return this.http.get<ApiResponse<Gasto>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }

  actualizar(id: number, body: GastoRequest): Observable<Gasto> {
    return this.http.put<ApiResponse<Gasto>>(`${this.api}/${id}`, body).pipe(map(r => r.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`).pipe(map(() => void 0));
  }
}
