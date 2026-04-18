// src/app/features/cajas/cierre-dialog/cierre-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar }  from '@angular/material/snack-bar';
import { CajaService }  from '../../../core/services/caja.service';
import { Caja }         from '../../../core/models/index';

@Component({
  selector: 'app-cierre-dialog',
  templateUrl: './cierre-dialog.component.html',
})
export class CierreDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cajaService: CajaService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<CierreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caja: Caja,
  ) {}

  // Anteriormente, el ngOnInit solo inicializaba el formulario. Ahora, al abrir el modal, también hacemos una llamada para obtener los totales actualizados de la caja, lo que nos permite mostrar al cajero cuánto efectivo se espera que haya antes de que ingrese el monto final real. Esto mejora la experiencia del usuario al darle contexto sobre su cierre de caja.
  /* ngOnInit(): void {
    this.form = this.fb.group({
      montoFinalReal: [null, [Validators.required, Validators.min(0)]],
    });
  } */
  //  CARGAR TOTALES AL ABRIR MODAL
    ngOnInit(): void {
  this.form = this.fb.group({
    montoFinalReal: [null, [Validators.required, Validators.min(0)]],
  });

  // 🔥 CARGAR TOTALES AL ABRIR MODAL
  this.loading = true;
  this.cajaService.cerrar(this.caja.id, {} as any).subscribe({
    next: (c) => {
      this.caja = c; // 🔥 ACTUALIZA LOS TOTALES
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}

  get efectivoEsperado(): number {
    return (this.caja.montoInicial ?? 0) + (this.caja.totalEfectivo ?? 0);
  }

  // CERRAR CAJA ANTIGUO
  cerrar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.cajaService.cerrar(this.caja.id, this.form.value).subscribe({
      next: (c) => {
        const diff = c.diferencia;
        const msg = diff === 0
          ? '¡Caja cerrada! Sin diferencias.'
          : `Caja cerrada. Diferencia: S/ ${diff.toFixed(2)}`;
        this.snack.open(msg, 'OK', { duration: 5000, panelClass: diff === 0 ? 'snack-success' : 'snack-warn' });
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'Error al cerrar caja', 'OK', { duration: 4000, panelClass: 'snack-error' });
      },
    });
  }

    /* cerrar(): void {
  if (this.form.invalid) { 
    this.form.markAllAsTouched(); 
    return; 
  }

  this.loading = true;

  this.cajaService.cerrar(this.caja.id, this.form.value).subscribe({
    next: (c) => {
      this.caja = c; // 🔥 importante

      const diff = c.diferencia;
      const msg = diff === 0
        ? '¡Caja cerrada! Sin diferencias.'
        : `Caja cerrada. Diferencia: S/ ${diff.toFixed(2)}`;

      this.snack.open(msg, 'OK', { duration: 5000 });

      this.dialogRef.close(true);
    },
    error: (e) => {
      this.loading = false;
      this.snack.open(e?.error?.message ?? 'Error al cerrar caja', 'OK', { duration: 4000 });
    },
  }); */
}

