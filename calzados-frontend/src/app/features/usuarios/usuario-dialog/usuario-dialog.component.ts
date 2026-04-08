// src/app/features/usuarios/usuario-dialog/usuario-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/index';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
})
export class UsuarioDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre:   [this.data?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
      email:    [this.data?.email  ?? '', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      rol:      [this.data?.rol    ?? 'CAJERO', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const req = this.isEdit
      ? this.userService.actualizar(this.data!.id, this.form.value)
      : this.userService.crear(this.form.value);

    req.subscribe({
      next: () => {
        this.snack.open(
          `Usuario ${this.isEdit ? 'actualizado' : 'creado'} exitosamente`,
          'OK', { duration: 3000, panelClass: 'snack-success' }
        );
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'Error al guardar', 'OK', {
          duration: 4000, panelClass: 'snack-error',
        });
      },
    });
  }
}
