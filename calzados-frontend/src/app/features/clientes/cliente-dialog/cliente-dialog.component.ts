// src/app/features/clientes/cliente-dialog/cliente-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/index';

@Component({
  selector: 'app-cliente-dialog',
  templateUrl: './cliente-dialog.component.html',
})
export class ClienteDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente | null,
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre:         [this.data?.nombre          ?? '', [Validators.required, Validators.maxLength(150)]],
      dni:            [this.data?.dni             ?? '', [Validators.pattern(/^\d{8}$/)]],
      ruc:            [this.data?.ruc             ?? '', [Validators.pattern(/^\d{11}$/)]],
      razonSocial:    [this.data?.razonSocial     ?? ''],
      numeroTelefono: [this.data?.numeroTelefono  ?? ''],
      email:          [this.data?.email           ?? '', [Validators.email]],
      direccion:      [this.data?.direccion       ?? ''],
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    // Limpiar campos vacíos para no enviar strings vacíos
    const raw = this.form.value;
    const body = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v === '' ? null : v])
    );

    this.loading = true;
    const req = this.isEdit
      ? this.clienteService.actualizar(this.data!.id, body as any)
      : this.clienteService.crear(body as any);

    req.subscribe({
      next: () => {
        this.snack.open(
          `Cliente ${this.isEdit ? 'actualizado' : 'creado'} exitosamente`,
          'OK', { duration: 3000, panelClass: 'snack-success' }
        );
        this.dialogRef.close(true);
      },
      error: e => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'Error al guardar', 'OK',
          { duration: 4000, panelClass: 'snack-error' });
      },
    });
  }
}
