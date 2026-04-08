// src/app/features/ventas/nueva-venta/nueva-venta.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from '../../../core/services/producto.service';
import { VentaService }    from '../../../core/services/venta.service';
import { CajaService }     from '../../../core/services/caja.service';
import { Variante, Caja, MetodoPago, DetalleVentaRequest } from '../../../core/models/index';

interface ItemCarrito {
  variante: Variante;
  cantidad: number;
  descuentoItem: number;  // porcentaje (0-100)
  subtotal: number;
}

@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.component.html',
  styleUrls: ['./nueva-venta.component.scss'],
})
export class NuevaVentaComponent implements OnInit {
  @ViewChild('scanInput') scanInput!: ElementRef;

  pagoForm!: FormGroup;
  codigoBarras = '';
  carrito: ItemCarrito[] = [];
  buscando = false;
  procesando = false;
  cajaAbierta: Caja | null = null;
  descuentoGlobal = 0;  // porcentaje (0-100)

  readonly metodosPago: MetodoPago[] = ['EFECTIVO', 'YAPE', 'TARJETA'];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private cajaService: CajaService,
    private snack: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.pagoForm = this.fb.group({
      metodoPago:    ['EFECTIVO', Validators.required],
      montoRecibido: [null],
      notas:         [''],
    });

    // Actualizar validación según método de pago
    this.pagoForm.get('metodoPago')!.valueChanges.subscribe(v => {
      const ctrl = this.pagoForm.get('montoRecibido')!;
      if (v === 'EFECTIVO') ctrl.setValidators([Validators.required, Validators.min(0)]);
      else ctrl.clearValidators();
      ctrl.updateValueAndValidity();
    });

    // Verificar caja abierta
    this.cajaService.miCaja().subscribe({
      next: c => { this.cajaAbierta = c; setTimeout(() => this.scanInput?.nativeElement?.focus(), 200); },
      error: () => {
        this.snack.open('No tienes una caja abierta. Apertura tu caja primero.', 'Ir a Cajas', { duration: 6000 })
          .onAction().subscribe(() => this.router.navigate(['/cajas']));
      },
    });
  }

  // ── Scanner ───────────────────────────────────────────────────────────────
  onScan(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    if (!input) return;
    this.buscarProducto(input);
    this.codigoBarras = '';
  }

  onScanKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.codigoBarras.trim()) {
      this.buscarProducto(this.codigoBarras.trim());
      this.codigoBarras = '';
    }
  }

  buscarProducto(codigo: string): void {
    this.buscando = true;
    this.productoService.scanearCodigoBarras(codigo).subscribe({
      next: variante => {
        this.buscando = false;
        if (variante.stock <= 0) {
          this.snack.open(`Sin stock disponible para ${codigo}`, 'OK', { duration: 3000, panelClass: 'snack-warn' });
          return;
        }
        this.agregarAlCarrito(variante);
        this.scanInput?.nativeElement?.focus();
      },
      error: () => {
        this.buscando = false;
        this.snack.open(`Producto no encontrado: ${codigo}`, 'OK', { duration: 3000, panelClass: 'snack-error' });
        this.scanInput?.nativeElement?.focus();
      },
    });
  }

  // ── Carrito ───────────────────────────────────────────────────────────────
  agregarAlCarrito(variante: Variante): void {
    const existing = this.carrito.find(i => i.variante.id === variante.id);
    if (existing) {
      if (existing.cantidad >= variante.stock) {
        this.snack.open('No puedes agregar más unidades. Stock agotado.', 'OK', { duration: 3000, panelClass: 'snack-warn' });
        return;
      }
      existing.cantidad++;
      this.recalcItem(existing);
    } else {
      const item: ItemCarrito = { variante, cantidad: 1, descuentoItem: 0, subtotal: variante.precioVenta };
      this.carrito.push(item);
    }
    this.snack.open(`✓ ${variante.sku} (T:${variante.talla}) agregado`, '', { duration: 1500 });
  }

  cambiarCantidad(item: ItemCarrito, delta: number): void {
    const nueva = item.cantidad + delta;
    if (nueva < 1 || nueva > item.variante.stock) return;
    item.cantidad = nueva;
    this.recalcItem(item);
  }

  setCantidad(item: ItemCarrito, val: string): void {
    const n = parseInt(val, 10);
    if (!n || n < 1 || n > item.variante.stock) return;
    item.cantidad = n;
    this.recalcItem(item);
  }

  setDescuentoItem(item: ItemCarrito, val: string): void {
    const pct = parseFloat(val) || 0;
    item.descuentoItem = Math.min(100, Math.max(0, pct));  // clamp 0-100
    this.recalcItem(item);
  }

  removeItem(item: ItemCarrito): void {
    this.carrito = this.carrito.filter(i => i !== item);
  }

  private recalcItem(item: ItemCarrito): void {
    // subtotal = precio × cantidad × (1 - descuento% / 100)
    item.subtotal = item.variante.precioVenta * item.cantidad * (1 - item.descuentoItem / 100);
  }

  // ── Totales ───────────────────────────────────────────────────────────────
  get subtotal(): number { return this.carrito.reduce((s, i) => s + i.subtotal, 0); }

  // total aplica descuento global como porcentaje sobre el subtotal
  get total(): number { return Math.max(0, this.subtotal * (1 - this.descuentoGlobal / 100)); }

  get vuelto(): number {
    const recibido = this.pagoForm.get('montoRecibido')?.value ?? 0;
    return Math.max(0, recibido - this.total);
  }

  get esEfectivo(): boolean { return this.pagoForm.get('metodoPago')?.value === 'EFECTIVO'; }

  // ── Procesar venta ────────────────────────────────────────────────────────
  procesarVenta(): void {
    if (this.carrito.length === 0) {
      this.snack.open('El carrito está vacío', 'OK', { duration: 2500 }); return;
    }
    if (this.pagoForm.invalid) { this.pagoForm.markAllAsTouched(); return; }
    if (this.esEfectivo && (this.pagoForm.get('montoRecibido')?.value ?? 0) < this.total) {
      this.snack.open('El monto recibido es menor al total', 'OK', { duration: 3000, panelClass: 'snack-error' }); return;
    }

    this.procesando = true;

    // Convertir % a monto real en soles para el backend
    const detalles: DetalleVentaRequest[] = this.carrito.map(i => ({
      varianteId:    i.variante.id,
      cantidad:      i.cantidad,
      descuentoItem: i.variante.precioVenta * i.cantidad * (i.descuentoItem / 100),
    }));

    const body = {
      metodoPago:    this.pagoForm.get('metodoPago')!.value,
      montoRecibido: this.esEfectivo ? this.pagoForm.get('montoRecibido')!.value : null,
      descuento:     this.subtotal * (this.descuentoGlobal / 100),  // monto real en soles al backend
      notas:         this.pagoForm.get('notas')!.value,
      detalles,
    };

    this.ventaService.registrar(body).subscribe({
      next: venta => {
        this.procesando = false;
        const msg = this.esEfectivo
          ? `Venta #${venta.id} registrada. Vuelto: S/ ${venta.vuelto?.toFixed(2)}`
          : `Venta #${venta.id} registrada exitosamente`;
        this.snack.open(msg, 'OK', { duration: 5000, panelClass: 'snack-success' });
        this.limpiar();
      },
      error: e => {
        this.procesando = false;
        this.snack.open(e?.error?.message ?? 'Error al registrar venta', 'OK', { duration: 5000, panelClass: 'snack-error' });
      },
    });
  }

  limpiar(): void {
    this.carrito = [];
    this.descuentoGlobal = 0;
    this.pagoForm.reset({ metodoPago: 'EFECTIVO', montoRecibido: null, notas: '' });
    this.codigoBarras = '';
    setTimeout(() => this.scanInput?.nativeElement?.focus(), 100);
  }
}