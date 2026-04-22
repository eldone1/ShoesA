import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Proveedor, ProveedorRequest } from '../../../core/models/index';
import { ProveedorService } from '../../../core/services/proveedor.service';

@Component({
  selector: 'app-proveedor-dialog',
  templateUrl: './proveedor-dialog.component.html',
})
export class ProveedorDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<ProveedorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Proveedor | null,
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [this.data?.nombre ?? '', [Validators.required, Validators.maxLength(150)]],
      ruc: [this.data?.ruc ?? '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      contacto: [this.data?.contacto ?? '', [Validators.required, Validators.maxLength(100)]],
      numeroTelefono: [this.data?.numeroTelefono ?? '', [Validators.required, Validators.maxLength(15)]],
      email: [this.data?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(150)]],
      direccion: [this.data?.direccion ?? '', [Validators.required, Validators.maxLength(250)]],
      diasCredito: [this.data?.diasCredito ?? 0, [Validators.required, Validators.min(0), Validators.max(365)]],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const body = this.form.value as ProveedorRequest;
    const req = this.isEdit
      ? this.proveedorService.actualizar(this.data!.id, body)
      : this.proveedorService.crear(body);

    req.subscribe({
      next: () => {
        this.snack.open(
          `Proveedor ${this.isEdit ? 'actualizado' : 'creado'} correctamente`,
          'OK',
          { duration: 3000, panelClass: 'snack-success' },
        );
        this.dialogRef.close(true);
      },
      error: e => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'Error al guardar', 'OK', {
          duration: 4000,
          panelClass: 'snack-error',
        });
      },
    });
  }
}
