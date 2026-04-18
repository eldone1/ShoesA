// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private snack: MatSnackBar) {}

  success(message: string, duration = 3000): void {
    this.show(message, 'snack-success', duration);
  }

  error(message: string, duration = 4500): void {
    this.show(message, 'snack-error', duration);
  }

  warn(message: string, duration = 4000): void {
    this.show(message, 'snack-warn', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, '', duration);
  }

  /** Extrae el mensaje de un HttpErrorResponse del backend */
  httpError(err: any, fallback = 'Ocurrió un error inesperado'): void {
    const msg = err?.error?.message ?? err?.error?.error ?? fallback;
    this.error(msg);
  }

  private show(message: string, panelClass: string, duration: number): void {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    };
    if (panelClass) config.panelClass = panelClass;
    this.snack.open(message, 'Cerrar', config);
  }
}
