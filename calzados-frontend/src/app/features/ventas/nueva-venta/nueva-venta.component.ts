// src/app/features/ventas/nueva-venta/nueva-venta.component.ts
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from '../../../core/services/producto.service';
import { VentaService }    from '../../../core/services/venta.service';
import { CajaService }     from '../../../core/services/caja.service';
import { Variante, Caja, MetodoPago, DetalleVentaRequest, ComprobanteResponse } from '../../../core/models/index';

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
export class NuevaVentaComponent implements OnInit, OnDestroy {
  @ViewChild('scanInput') scanInput!: ElementRef;

  private readonly REDONDEO_EFECTIVO_STEP = 0.05;
  private readonly SCAN_MAX_GAP_MS = 60;
  private readonly SCAN_MIN_LENGTH = 5;

  private scanBuffer = '';
  private scanTimer: ReturnType<typeof setTimeout> | null = null;
  private scanLastKeyAt = 0;
  private scanOriginElement: HTMLInputElement | HTMLTextAreaElement | null = null;
  private scanOriginValue = '';

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
    private dialog: MatDialog,
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

  ngOnDestroy(): void {
    this.limpiarBufferScanner();
  }

  @HostListener('window:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    if (this.procesando) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === 'Escape') {
      this.limpiarBufferScanner();
      return;
    }

    if (event.key === 'Enter' || event.key === 'Tab') {
      if (this.scanBuffer.trim().length >= this.SCAN_MIN_LENGTH) {
        event.preventDefault();
        this.procesarBufferScanner();
      }
      return;
    }

    if (event.key.length !== 1) return;

    const now = Date.now();
    if (this.scanLastKeyAt && now - this.scanLastKeyAt > this.SCAN_MAX_GAP_MS) {
      this.limpiarBufferScanner();
    }

    if (!this.scanBuffer) {
      this.scanOriginElement = this.obtenerEditable(event.target);
      this.scanOriginValue = this.scanOriginElement?.value ?? '';
    }

    this.scanLastKeyAt = now;
    this.scanBuffer += event.key;

    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
    }

    this.scanTimer = setTimeout(() => this.procesarBufferScanner(), this.SCAN_MAX_GAP_MS);
  }

  private obtenerEditable(target: EventTarget | null): HTMLInputElement | HTMLTextAreaElement | null {
    if (!target || !(target instanceof HTMLElement)) return null;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return target;
    return null;
  }

  private procesarBufferScanner(): void {
    const codigo = this.scanBuffer.trim();
    const origin = this.scanOriginElement;
    const originValue = this.scanOriginValue;
    this.limpiarBufferScanner();

    if (codigo.length < this.SCAN_MIN_LENGTH) return;

    if (origin && origin.value !== originValue) {
      origin.value = originValue;
      origin.dispatchEvent(new Event('input', { bubbles: true }));
      origin.dispatchEvent(new Event('change', { bubbles: true }));
    }

    this.codigoBarras = codigo;
    this.buscarProducto(codigo);
  }

  private limpiarBufferScanner(): void {
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }
    this.scanBuffer = '';
    this.scanLastKeyAt = 0;
    this.scanOriginElement = null;
    this.scanOriginValue = '';
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
        this.codigoBarras = '';
        this.scanInput?.nativeElement?.focus();
      },
      error: () => {
        this.buscando = false;
        this.snack.open(`Producto no encontrado: ${codigo}`, 'OK', { duration: 3000, panelClass: 'snack-error' });
        this.codigoBarras = '';
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
    const itemLabel = variante.productoNombre ?? variante.sku;
    this.snack.open(`✓ ${itemLabel} (T:${variante.talla}) agregado`, '', { duration: 1500 });
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
  get totalExacto(): number { return Math.max(0, this.subtotal * (1 - this.descuentoGlobal / 100)); }

  // En efectivo se redondea al sol más cercano para facilitar vuelto.
  get totalCobrar(): number {
    if (!this.esEfectivo) return this.totalExacto;

    // Redondeo a favor del cliente: siempre hacia abajo al multiplo configurado.
    const factor = 1 / this.REDONDEO_EFECTIVO_STEP;
    return Math.floor(this.totalExacto * factor) / factor;
  }

  get vuelto(): number {
    const recibido = this.pagoForm.get('montoRecibido')?.value ?? 0;
    return Math.max(0, recibido - this.totalCobrar);
  }

  get esEfectivo(): boolean { return this.pagoForm.get('metodoPago')?.value === 'EFECTIVO'; }

  getSubtotalBrutoItem(item: ItemCarrito): number {
    return item.variante.precioVenta * item.cantidad;
  }

  getMontoDescuentoItem(item: ItemCarrito): number {
    return this.getSubtotalBrutoItem(item) * (item.descuentoItem / 100);
  }

  // ── Procesar venta ────────────────────────────────────────────────────────
  procesarVenta(): void {
    if (this.carrito.length === 0) {
      this.snack.open('El carrito está vacío', 'OK', { duration: 2500 }); return;
    }
    if (this.pagoForm.invalid) { this.pagoForm.markAllAsTouched(); return; }
    if (this.esEfectivo && (this.pagoForm.get('montoRecibido')?.value ?? 0) < this.totalCobrar) {
      this.snack.open('El monto recibido es menor al total', 'OK', { duration: 3000, panelClass: 'snack-error' }); return;
    }

    this.procesando = true;

    // Convertir % a monto real en soles para el backend
    const detalles: DetalleVentaRequest[] = this.carrito.map(i => ({
      varianteId:    i.variante.id,
      cantidad:      i.cantidad,
      descuentoItem: i.variante.precioVenta * i.cantidad * (i.descuentoItem / 100),
    }));

    const descuentoGlobalBase = this.subtotal * (this.descuentoGlobal / 100);
    const ajusteRedondeo = this.totalExacto - this.totalCobrar;
    const descuentoAEnviar = Math.max(0, descuentoGlobalBase + ajusteRedondeo);

    const body = {
      metodoPago:    this.pagoForm.get('metodoPago')!.value,
      montoRecibido: this.esEfectivo ? this.pagoForm.get('montoRecibido')!.value : null,
      // Ajuste de redondeo (sin enviar descuentos negativos por validación backend).
      descuento:     descuentoAEnviar,
      notas:         this.pagoForm.get('notas')!.value,
      detalles,
    };

    this.ventaService.registrar(body).subscribe({
      next: venta => {
        this.procesando = false;
        this.abrirDialogoComprobante(venta);
      },
      error: e => {
        this.procesando = false;
        this.snack.open(e?.error?.message ?? 'Error al registrar venta', 'OK', { duration: 5000, panelClass: 'snack-error' });
      },
    });
  }

  private abrirDialogoComprobante(venta: any): void {
    import('../../comprobantes/emitir-comprobante-dialog/emitir-comprobante-dialog.component')
      .then(m => {
        const ref = this.dialog.open(m.EmitirComprobanteDialogComponent, {
          width: '580px',
          disableClose: true,
          data: venta,
        });

        ref.afterClosed().subscribe((comp: ComprobanteResponse | undefined) => {
          const vueltoLocal = this.vuelto;
          const msg = this.esEfectivo
            ? `Venta #${venta.id} registrada. Vuelto: S/ ${vueltoLocal.toFixed(2)}`
            : `Venta #${venta.id} registrada exitosamente`;

          if (comp?.id) {
            this.snack.open(`Comprobante ${comp.serie} emitido. Enviando a impresión...`, 'OK', {
              duration: 4000,
              panelClass: 'snack-success',
            });
            this.limpiar();
            this.router.navigate(['/comprobantes', comp.id], { queryParams: { print: '1' } });
            return;
          }

          this.snack.open(`${msg} (sin comprobante emitido)`, 'OK', {
            duration: 5000,
            panelClass: 'snack-warn',
          });
          this.limpiar();
        });
      })
      .catch(() => {
        this.snack.open(
          `Venta #${venta.id} registrada, pero no se pudo abrir emisión de comprobante.`,
          'OK',
          { duration: 5000, panelClass: 'snack-warn' },
        );
        this.limpiar();
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