import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { GastoRequest, TipoGasto } from '../../../core/models/index';
import { GastoService } from '../../../core/services/gasto.service';

@Component({
  selector: 'app-gasto-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './gasto-dialog.component.html',
  styleUrls: ['./gasto-dialog.component.scss'],
})
export class GastoDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  tipos: TipoGasto[] = [
    'CREDITO_PROVEEDOR',
    'LUZ',
    'INTERNET',
    'ALQUILER',
    'PLANILLA',
    'TRANSPORTE',
    'OTRO',
  ];

  constructor(
    private fb: FormBuilder,
    private gastoService: GastoService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<GastoDialogComponent>,
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.form = this.fb.group({
      tipo: ['OTRO' as TipoGasto, Validators.required],
      concepto: ['', [Validators.required, Validators.maxLength(180)]],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fechaGasto: [today, Validators.required],
      descripcion: [''],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: GastoRequest = {
      tipo: this.form.value.tipo,
      concepto: this.form.value.concepto,
      monto: Number(this.form.value.monto),
      fechaGasto: this.form.value.fechaGasto,
      descripcion: this.form.value.descripcion || null,
    };

    this.loading = true;
    this.gastoService.crear(body).subscribe({
      next: () => {
        this.snack.open('Gasto registrado exitosamente', 'OK', { duration: 3000, panelClass: 'snack-success' });
        this.dialogRef.close(true);
      },
      error: e => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'No se pudo registrar el gasto', 'OK', {
          duration: 4000,
          panelClass: 'snack-error',
        });
      },
    });
  }
}
