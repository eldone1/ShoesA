// src/app/core/interceptors/jwt.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // Agregar token a todas las peticiones si existe
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            // Token expirado o inválido → logout automático
            this.authService.logout();
            this.snackBar.open('Sesión expirada. Inicia sesión nuevamente.', 'Cerrar', { duration: 4000 });
            break;
          case 403:
            this.snackBar.open('No tienes permisos para realizar esta acción.', 'Cerrar', { duration: 4000 });
            this.router.navigate(['/dashboard']);
            break;
          case 0:
            this.snackBar.open('No se puede conectar al servidor. Verifica que el backend esté activo.', 'Cerrar', { duration: 5000 });
            break;
          default:
            // Los errores 400/404/500 los manejan los propios componentes
            break;
        }
        return throwError(() => error);
      })
    );
  }
}
