// src/app/features/productos/producto-dialog/producto-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto, Marca } from '../../../core/models/index';

@Component({
  selector: 'app-producto-dialog',
  templateUrl: './producto-dialog.component.html',
  styleUrls: ['./producto-dialog.component.scss'],
})
export class ProductoDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;
  marcas: Marca[];
  producto: Producto | null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<ProductoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { producto: Producto | null; marcas: Marca[] },
  ) {
    this.isEdit  = !!data.producto;
    this.producto = data.producto;
    this.marcas  = data.marcas;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      marcaId:     [this.producto?.marca?.id ?? null],
      nombre:      [this.producto?.nombre ?? '', [Validators.required, Validators.maxLength(150)]],
      descripcion: [this.producto?.descripcion ?? ''],
      variantes:   this.fb.array([]),
    });

    if (this.isEdit && this.producto?.variantes?.length) {
      this.producto.variantes.forEach(v => this.addVariante(v));
    } else if (!this.isEdit) {
      this.addVariante();
    }
  }

  get variantes(): FormArray { return this.form.get('variantes') as FormArray; }

  addVariante(v?: any): void {
    this.variantes.push(this.fb.group({
      id: [v?.id ?? null],
      color:              [v?.color ?? ''],
      talla:              [v?.talla ?? ''],
      sku:                [v?.sku ?? ''],
      codigoBarras:       [v?.codigoBarras ?? ''],
      precioCompra:       [v?.precioCompra ?? null, [Validators.required, Validators.min(0.01)]],
      porcentajeGanancia: [v?.porcentajeGanancia ?? 0, [Validators.required, Validators.min(0)]],
      stock:              [v?.stock ?? 0, [Validators.required, Validators.min(0)]],
      stockMinimo:        [v?.stockMinimo ?? 5, [Validators.min(0)]],
    }));
  }

  removeVariante(i: number): void {
    if (this.variantes.length > 1) this.variantes.removeAt(i);
  }

  precioVentaPreview(ctrl: AbstractControl): string {
    const compra = ctrl.get('precioCompra')?.value ?? 0;
    const pct    = ctrl.get('porcentajeGanancia')?.value ?? 0;
    if (!compra) return '—';
    const pv = compra * (1 + pct / 100);
    return `S/ ${pv.toFixed(2)}`;
  }

  // primer save
 /*  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const body = this.form.value;

    const req = this.isEdit
      ? this.productoService.actualizar(this.producto!.id, body)
      : this.productoService.crear(body);

    req.subscribe({
      next: () => {
        this.snack.open(`Producto ${this.isEdit ? 'actualizado' : 'creado'}`, 'OK', { duration: 3000, panelClass: 'snack-success' });
        this.dialogRef.close(true);
      },
      error: e => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'Error al guardar', 'OK', { duration: 4000, panelClass: 'snack-error' });
      },
    });
  } */
 
  /* save(): void {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  this.loading = true;
  const body = this.form.value;

  const productoBody = {
    marcaId: body.marcaId,
    nombre: body.nombre,
    descripcion: body.descripcion,
    variantes: []
  };

  const varianteCalls$ = (body.variantes as any[])
    .filter(v => v.id) // ← solo las que tienen id válido
    .map(v => this.productoService.actualizarVariante(this.producto!.id, v.id, v));

  const nuevas$ = (body.variantes as any[])
    .filter(v => !v.id)
    .map(v => this.productoService.agregarVariante(this.producto!.id, v));

  const todas$ = [...varianteCalls$, ...nuevas$];

  // Si no hay variantes que actualizar, usar of(null) para que forkJoin no falle
  const calls$ = todas$.length > 0 ? todas$ : [of(null)];

  this.productoService.actualizar(this.producto!.id, productoBody).pipe(
    switchMap(() => forkJoin(calls$))
  ).subscribe({
    next: () => {
      this.loading = false;
      this.snack.open('Producto actualizado', 'OK', { duration: 3000, panelClass: 'snack-success' });
      this.dialogRef.close(true);
    },
    error: e => {
      this.loading = false;
      this.snack.open(e?.error?.message ?? 'Error al guardar', 'OK', { duration: 4000, panelClass: 'snack-error' });
    }
  });
} */
 
  save(): void {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  this.loading = true;
  const body = this.form.value;

  if (!this.isEdit) {
  const crearBody = {
    marcaId: body.marcaId,
    nombre: body.nombre,
    descripcion: body.descripcion,
    variantes: (body.variantes as any[]).map(({ id, ...rest }) => rest) // ← quita el id
  };

  this.productoService.crear(crearBody).subscribe({
    next: () => {
      this.loading = false;
      this.snack.open('Producto creado', 'OK', { duration: 3000, panelClass: 'snack-success' });
      this.dialogRef.close(true);
    },
    error: e => {
      this.loading = false;
      this.snack.open(e?.error?.message ?? 'Error al guardar', 'OK', { duration: 4000, panelClass: 'snack-error' });
    }
  });
  return;
  }

  // ─── EDITAR: producto + variantes por separado
  const productoBody = {
    marcaId: body.marcaId,
    nombre: body.nombre,
    descripcion: body.descripcion,
    variantes: []
  };

  const varianteCalls$ = (body.variantes as any[])
    .filter(v => v.id)
    .map(v => this.productoService.actualizarVariante(this.producto!.id, v.id, v));

  const nuevas$ = (body.variantes as any[])
    .filter(v => !v.id)
    .map(v => this.productoService.agregarVariante(this.producto!.id, v));

  const todas$ = [...varianteCalls$, ...nuevas$];
  const calls$ = todas$.length > 0 ? todas$ : [of(null)];

  this.productoService.actualizar(this.producto!.id, productoBody).pipe(
    switchMap(() => forkJoin(calls$))
  ).subscribe({
    next: () => {
      this.loading = false;
      this.snack.open('Producto actualizado', 'OK', { duration: 3000, panelClass: 'snack-success' });
      this.dialogRef.close(true);
    },
    error: e => {
      this.loading = false;
      this.snack.open(e?.error?.message ?? 'Error al guardar', 'OK', { duration: 4000, panelClass: 'snack-error' });
    }
  });
}
}
