// src/app/core/services/confirm.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  constructor(private dialog: MatDialog) {}

  /** Abre el diálogo de confirmación. Emite true si el usuario confirma. */
  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialogComponent, { width: '380px', data })
      .afterClosed()
      .pipe(map(result => result === true));
  }

  /** Atajo para confirmaciones de eliminación */
  delete(itemName: string): Observable<boolean> {
    return this.confirm({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      danger: true,
    });
  }
}
