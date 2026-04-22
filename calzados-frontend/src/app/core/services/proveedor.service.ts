import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  EstadoSolicitudCompra,
  Proveedor,
  ProveedorRequest,
  RecepcionMercaderiaRequest,
  SolicitudCompra,
  SolicitudCompraRequest,
} from '../models/index';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private api = `${environment.apiUrl}/proveedores`;
  private apiSolicitudes = `${environment.apiUrl}/proveedores/solicitudes`;

  constructor(private http: HttpClient) {}

  listar(incluirInactivos = false, q?: string): Observable<Proveedor[]> {
    let params = new HttpParams().set('incluirInactivos', incluirInactivos.toString());
    if (q && q.trim()) {
      params = params.set('q', q.trim());
    }
    return this.http.get<ApiResponse<Proveedor[]>>(this.api, { params }).pipe(map(r => r.data));
  }

  obtener(id: number): Observable<Proveedor> {
    return this.http.get<ApiResponse<Proveedor>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }

  crear(body: ProveedorRequest): Observable<Proveedor> {
    return this.http.post<ApiResponse<Proveedor>>(this.api, body).pipe(map(r => r.data));
  }

  actualizar(id: number, body: ProveedorRequest): Observable<Proveedor> {
    return this.http.put<ApiResponse<Proveedor>>(`${this.api}/${id}`, body).pipe(map(r => r.data));
  }

  cambiarEstado(id: number, activo: boolean): Observable<void> {
    const params = new HttpParams().set('activo', activo.toString());
    return this.http.patch<ApiResponse<void>>(`${this.api}/${id}/estado`, null, { params })
      .pipe(map(() => void 0));
  }

  crearSolicitud(body: SolicitudCompraRequest): Observable<SolicitudCompra> {
    return this.http.post<ApiResponse<SolicitudCompra>>(this.apiSolicitudes, body).pipe(map(r => r.data));
  }

  listarSolicitudes(filters?: {
    proveedorId?: number;
    estado?: EstadoSolicitudCompra;
    pagado?: boolean;
    desde?: string;
    hasta?: string;
  }): Observable<SolicitudCompra[]> {
    let params = new HttpParams();
    if (filters?.proveedorId != null) params = params.set('proveedorId', filters.proveedorId.toString());
    if (filters?.estado) params = params.set('estado', filters.estado);
    if (filters?.pagado != null) params = params.set('pagado', filters.pagado.toString());
    if (filters?.desde) params = params.set('desde', filters.desde);
    if (filters?.hasta) params = params.set('hasta', filters.hasta);
    return this.http.get<ApiResponse<SolicitudCompra[]>>(this.apiSolicitudes, { params }).pipe(map(r => r.data));
  }

  obtenerSolicitud(id: number): Observable<SolicitudCompra> {
    return this.http.get<ApiResponse<SolicitudCompra>>(`${this.apiSolicitudes}/${id}`).pipe(map(r => r.data));
  }

  recepcionar(id: number, body: RecepcionMercaderiaRequest): Observable<SolicitudCompra> {
    return this.http.post<ApiResponse<SolicitudCompra>>(`${this.apiSolicitudes}/${id}/recepcionar`, body)
      .pipe(map(r => r.data));
  }

  marcarPagado(id: number, pagado: boolean): Observable<SolicitudCompra> {
    const params = new HttpParams().set('pagado', pagado.toString());
    return this.http.patch<ApiResponse<SolicitudCompra>>(`${this.apiSolicitudes}/${id}/pagado`, null, { params })
      .pipe(map(r => r.data));
  }
}
