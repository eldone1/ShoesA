// src/app/features/comprobantes/emitir-comprobante-dialog/emitir-comprobante-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ClienteService }     from '../../../core/services/cliente.service';
import { Venta, Cliente, ComprobanteResponse } from '../../../core/models/index';

@Component({
  selector: 'app-emitir-comprobante-dialog',
  templateUrl: './emitir-comprobante-dialog.component.html',
  styleUrls: ['./emitir-comprobante-dialog.component.scss'],
})
export class EmitirComprobanteDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  // Autocompletar cliente
  clientesFiltrados: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  busquedaCliente = '';
  private busqueda$ = new Subject<string>();
  buscandoCliente = false;

  constructor(
    private fb: FormBuilder,
    private comprobanteService: ComprobanteService,
    private clienteService: ClienteService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<EmitirComprobanteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public venta: Venta,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipo:            ['BOLETA', Validators.required],
      // Datos manuales (por si no se selecciona cliente registrado)
      clienteNombre:   [''],
      clienteDni:      ['', Validators.pattern(/^\d{8}$/)],
      clienteRuc:      ['', Validators.pattern(/^\d{11}$/)],
      clienteRazonSocial: [''],
      clienteDireccion:   [''],
      clienteEmail:       ['', Validators.email],
    });

    // Validar RUC obligatorio al elegir FACTURA
    this.form.get('tipo')!.valueChanges.subscribe(tipo => {
      const rucCtrl = this.form.get('clienteRuc')!;
      if (tipo === 'FACTURA') {
        rucCtrl.setValidators([Validators.required, Validators.pattern(/^\d{11}$/)]);
      } else {
        rucCtrl.setValidators([Validators.pattern(/^\d{11}$/)]);
      }
      rucCtrl.updateValueAndValidity();
    });

    // Autocompletar clientes con debounce
    this.busqueda$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q || q.length < 2) return of([]);
        this.buscandoCliente = true;
        return this.clienteService.buscar(q).pipe(catchError(() => of([])));
      }),
    ).subscribe(clientes => {
      this.clientesFiltrados = clientes;
      this.buscandoCliente = false;
    });
  }

  onBusquedaCliente(q: string): void {
    this.busqueda$.next(q);
  }

  seleccionarCliente(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.busquedaCliente = cliente.nombre + (cliente.dni ? ` (${cliente.dni})` : '');
    this.clientesFiltrados = [];
    // Rellenar formulario con datos del cliente
    this.form.patchValue({
      clienteNombre:      cliente.nombre,
      clienteDni:         cliente.dni      ?? '',
      clienteRuc:         cliente.ruc      ?? '',
      clienteRazonSocial: cliente.razonSocial ?? '',
      clienteDireccion:   cliente.direccion   ?? '',
      clienteEmail:       cliente.email       ?? '',
    });
  }

  limpiarCliente(): void {
    this.clienteSeleccionado = null;
    this.busquedaCliente = '';
    this.clientesFiltrados = [];
    this.form.patchValue({
      clienteNombre: '', clienteDni: '', clienteRuc: '',
      clienteRazonSocial: '', clienteDireccion: '', clienteEmail: '',
    });
  }

  get esFactura(): boolean { return this.form.get('tipo')?.value === 'FACTURA'; }
  get esBoleta(): boolean  { return this.form.get('tipo')?.value === 'BOLETA'; }

  emitir(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const f = this.form.value;
    const body = {
      ventaId:    this.venta.id,
      tipo:       f.tipo,
      clienteId:  this.clienteSeleccionado?.id ?? null,
      clienteNombre:      f.clienteNombre      || null,
      clienteDni:         f.clienteDni         || null,
      clienteRuc:         f.clienteRuc         || null,
      clienteRazonSocial: f.clienteRazonSocial || null,
      clienteDireccion:   f.clienteDireccion   || null,
      clienteEmail:       f.clienteEmail       || null,
    };

    this.comprobanteService.emitir(body).subscribe({
      next: (comp: ComprobanteResponse) => {
        this.snack.open(`¡${comp.serie} emitido exitosamente!`, 'OK',
          { duration: 4000, panelClass: 'snack-success' });
        this.dialogRef.close(comp);
      },
      error: e => {
        this.loading = false;
        this.snack.open(e?.error?.message ?? 'Error al emitir', 'OK',
          { duration: 5000, panelClass: 'snack-error' });
      },
    });
  }
}
