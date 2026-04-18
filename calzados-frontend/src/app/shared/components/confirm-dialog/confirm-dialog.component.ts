// src/app/shared/components/confirm-dialog/confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="display:flex;align-items:center;gap:8px">
      <mat-icon [style.color]="data.danger ? '#c62828' : '#3949ab'">
        {{ data.danger ? 'warning' : 'help_outline' }}
      </mat-icon>
      {{ data.title }}
    </h2>
    <mat-dialog-content>
      <p style="font-size:15px;color:#424242;margin:0">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">
        {{ data.cancelLabel ?? 'Cancelar' }}
      </button>
      <button mat-raised-button
              [color]="data.danger ? 'warn' : 'primary'"
              [mat-dialog-close]="true">
        {{ data.confirmLabel ?? 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}
}
