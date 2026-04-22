import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CondicionPagoCompra,
  Producto,
  Proveedor,
  SolicitudCompra,
  SolicitudCompraRequest,
  Variante,
} from '../../../core/models/index';
import { ProductoService } from '../../../core/services/producto.service';
import { ProveedorService } from '../../../core/services/proveedor.service';

@Component({
  selector: 'app-solicitud-compra-dialog',
  templateUrl: './solicitud-compra-dialog.component.html',
  styleUrls: ['./solicitud-compra-dialog.component.scss'],
})
export class SolicitudCompraDialogComponent implements OnInit {
  solicitudForm!: FormGroup;
  productos: Producto[] = [];
  variantesPorFila: Variante[][] = [];
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<SolicitudCompraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public proveedor: Proveedor,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProductos();
  }

  get detalles(): FormArray {
    return this.solicitudForm.get('detalles') as FormArray;
  }

  private initForm(): void {
    this.solicitudForm = this.fb.group({
      condicionPago: ['CREDITO' as CondicionPagoCompra, Validators.required],
      fechaVencimiento: [null],
      observacion: [''],
      detalles: this.fb.array([]),
    });

    this.solicitudForm.get('condicionPago')?.valueChanges.subscribe(value => {
      const fechaCtrl = this.solicitudForm.get('fechaVencimiento');
      if (value === 'CREDITO') {
        fechaCtrl?.addValidators(Validators.required);
      } else {
        fechaCtrl?.clearValidators();
        fechaCtrl?.setValue(null);
      }
      fechaCtrl?.updateValueAndValidity();
    });

    this.addDetalle();
  }

  private createDetalleForm(): FormGroup {
    return this.fb.group({
      productoId: [null, Validators.required],
      varianteId: [null, Validators.required],
      cantidadSolicitada: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  addDetalle(): void {
    this.detalles.push(this.createDetalleForm());
    this.variantesPorFila.push([]);
  }

  removeDetalle(index: number): void {
    if (this.detalles.length <= 1) {
      this.snack.open('Debe mantener al menos un detalle', 'OK', { duration: 3000 });
      return;
    }
    this.detalles.removeAt(index);
    this.variantesPorFila.splice(index, 1);
  }

  getVariantes(index: number): Variante[] {
    return this.variantesPorFila[index] || [];
  }

  onProductoChange(index: number): void {
    const productoId = this.detalles.at(index).get('productoId')?.value;
    if (productoId) {
      const producto = this.productos.find(p => p.id === productoId);
      if (producto && producto.variantes) {
        this.variantesPorFila[index] = producto.variantes;
        this.detalles.at(index).get('varianteId')?.setValue(null);
      }
    }
  }

  private loadProductos(): void {
    this.productoService.listar().subscribe(
      productos => {
        this.productos = productos;
      },
      error => {
        this.snack.open('Error al cargar productos', 'OK', { duration: 3000 });
      },
    );
  }

  guardarSolicitud(): void {
    if (!this.solicitudForm.valid) {
      this.snack.open('Por favor complete todos los campos requeridos', 'OK', { duration: 3000 });
      return;
    }

    this.guardando = true;
    const raw = this.solicitudForm.value;
    const request: SolicitudCompraRequest = {
      proveedorId: this.proveedor.id,
      condicionPago: raw.condicionPago,
      fechaVencimiento: raw.condicionPago === 'CREDITO' ? raw.fechaVencimiento : null,
      observacion: raw.observacion,
      detalles: raw.detalles.map((d: any) => ({
        productoId: Number(d.productoId),
        varianteId: Number(d.varianteId),
        cantidadSolicitada: Number(d.cantidadSolicitada),
        precioUnitario: Number(d.precioUnitario),
      })),
    };

    this.proveedorService.crearSolicitud(request).subscribe({
      next: (response: SolicitudCompra) => {
        this.snack.open('Solicitud de compra registrada correctamente', 'OK', { duration: 3000 });
        this.dialogRef.close(response);
      },
      error: (error: any) => {
        this.snack.open('Error al registrar solicitud de compra', 'OK', { duration: 3000 });
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
