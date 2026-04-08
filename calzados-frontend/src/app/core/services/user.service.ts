// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User, UserRequest } from './index-models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  listar(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(this.api).pipe(map(r => r.data));
  }
  obtener(id: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }
  crear(body: UserRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(this.api, body).pipe(map(r => r.data));
  }
  actualizar(id: number, body: UserRequest): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.api}/${id}`, body).pipe(map(r => r.data));
  }
  cambiarEstado(id: number, activo: boolean): Observable<void> {
    const params = new HttpParams().set('activo', activo.toString());
    return this.http.patch<ApiResponse<void>>(`${this.api}/${id}/estado`, null, { params }).pipe(map(() => void 0));
  }
}
