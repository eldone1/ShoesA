// src/app/features/cajas/apertura-dialog/apertura-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar }  from '@angular/material/snack-bar';
import { CajaService }  from '../../../core/services/caja.service';

@Component({
  selector: 'app-apertura-dialog',
  template: `
    <h2 mat-dialog-title>Aperturar Caja</h2>
    <mat-dialog-content>
      <p style="color:#757575;margin-bottom:16px">Ingresa el monto en efectivo con el que inicias el turno.</p>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Monto inicial (S/)</mat-label>
          <mat-icon matPrefix>payments</mat-icon>
          <input matInput type="number" min="0" step="0.01" formControlName="montoInicial">
          <mat-error *ngIf="form.get('montoInicial')?.hasError('required')">Requerido</mat-error>
          <mat-error *ngIf="form.get('montoInicial')?.hasError('min')">Debe ser ≥ 0</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="abrir()" [disabled]="loading">
        <mat-spinner *ngIf="loading" diameter="18" style="display:inline-block"></mat-spinner>
        Aperturar
      </button>
    </mat-dialog-actions>
  `,
})
export class AperturaDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cajaService: CajaService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<AperturaDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      montoInicial: [0, [Validators.required, Validators.min(0)]],
    });
  }

  abrir(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.cajaService.abrir(this.form.value).subscribe({
      next: () => {
        this.snack.open('¡Caja aperturada exitosamente!', 'OK', { duration: 3000, panelClass: 'snack-success' });
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'Error al aperturar', 'OK', { duration: 4000, panelClass: 'snack-error' });
      },
    });
  }
}
