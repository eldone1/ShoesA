// src/app/features/marcas/marca-dialog/marca-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarcaService } from '../../../core/services/marca.service';
import { Marca } from '../../../core/models/index';

@Component({
  selector: 'app-marca-dialog',
  templateUrl: './marca-dialog.component.html',
})
export class MarcaDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private marcaService: MarcaService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<MarcaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Marca | null,
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [this.data?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const req = this.isEdit
      ? this.marcaService.actualizar(this.data!.id, this.form.value)
      : this.marcaService.crear(this.form.value);

    req.subscribe({
      next: () => {
        this.snack.open(`Marca ${this.isEdit ? 'actualizada' : 'creada'}`, 'OK', { duration: 3000, panelClass: 'snack-success' });
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'Error al guardar', 'OK', { duration: 4000, panelClass: 'snack-error' });
      },
    });
  }
}
