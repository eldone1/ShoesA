// src/app/features/comprobantes/comprobante-detalle/comprobante-detalle.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { ComprobanteResponse } from '../../../core/models/index';

@Component({
  selector: 'app-comprobante-detalle',
  templateUrl: './comprobante-detalle.component.html',
  styleUrls: ['./comprobante-detalle.component.scss'],
})
export class ComprobanteDetalleComponent implements OnInit {
  comprobante: ComprobanteResponse | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comprobanteService: ComprobanteService,
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    const autoPrint = this.route.snapshot.queryParamMap.get('print') === '1';
    this.comprobanteService.obtener(id).subscribe({
      next:  c => {
        this.comprobante = c;
        this.loading = false;
        if (autoPrint) {
          setTimeout(() => this.imprimir(), 250);
        }
      },
      error: () => { this.error = true; this.loading = false; },
    });
  }

  volver(): void { this.router.navigate(['/comprobantes']); }

  imprimir(): void {
    if (!this.comprobante) return;

    const popup = window.open('', '_blank', 'noopener,noreferrer,width=320,height=900');
    if (!popup) {
      alert('El navegador bloqueó la impresión automática. Haz clic en "Imprimir".');
      return;
    }

    const detalleRows = (this.comprobante.detalles ?? []).map((d: any) => `
      <tr>
        <td>
          <div class="nombre">${this.escapeHtml(d.productoNombre ?? '')}</div>
          <div class="det">T: ${this.escapeHtml(d.talla ?? '')} | ${this.escapeHtml(d.color ?? '')}</div>
        </td>
        <td class="c">${d.cantidad ?? 0}</td>
        <td class="r">${this.formatMoney(d.precioUnitario)}</td>
        <td class="r">${d.descuentoItem > 0 ? this.formatMoney(d.descuentoItem) : '-'}</td>
        <td class="r total">${this.formatMoney(d.subtotal)}</td>
      </tr>
    `).join('');

    const html = `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ticket ${this.escapeHtml(this.comprobante.serie)}</title>
  <style>
    @page { size: 58mm auto; margin: 2mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      color: #000;
      background: #fff;
      display: flex;
      justify-content: center;
    }
    .ticket { width: 54mm; font-size: 10px; line-height: 1.3; }
    .center { text-align: center; }
    .empresa { font-size: 14px; font-weight: 700; letter-spacing: .2px; }
    .sub { font-size: 10px; }
    .line { border-top: 1px dashed #000; margin: 6px 0; }
    .meta { font-size: 10.5px; }
    .meta-row { display: flex; justify-content: space-between; gap: 8px; }
    .cliente { font-size: 10.5px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { text-align: left; border-bottom: 1px solid #000; padding: 3px 1px; font-weight: 700; }
    td { border-bottom: 1px dotted #bbb; padding: 3px 1px; vertical-align: top; }
    .nombre { font-weight: 600; }
    .det { font-size: 9px; }
    .c { text-align: center; width: 26px; }
    .r { text-align: right; white-space: nowrap; }
    .totales { margin-top: 4px; font-size: 10.5px; }
    .row { display: flex; justify-content: space-between; padding: 1px 0; }
    .row.total { font-size: 12px; font-weight: 700; margin-top: 2px; }
    .footer { text-align: center; margin-top: 8px; border-top: 1px dashed #000; padding-top: 6px; font-size: 10px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="center">
      <div class="empresa">CALZADOS POS</div>
      <div class="sub">Sistema de Punto de Venta</div>
      <div>${this.escapeHtml(this.comprobante.tipo)} - ${this.escapeHtml(this.comprobante.serie)}</div>
    </div>

    <div class="line"></div>
    <div class="meta">
      <div class="meta-row"><span>Fecha de emisión:</span><span>${this.escapeHtml(this.formatDate(this.comprobante.fechaEmision))}</span></div>
      <div class="meta-row"><span>Cajero:</span><span>${this.escapeHtml(this.comprobante.cajeroNombre)}</span></div>
      <div class="meta-row"><span>Método de pago:</span><span>${this.escapeHtml(this.comprobante.metodoPago)}</span></div>
    </div>

    <div class="line"></div>
    <div class="cliente">
      <div><strong>Cliente:</strong> ${this.escapeHtml(this.clienteNombreTicket)}</div>
      ${this.clienteDocTicket ? `<div><strong>Documento:</strong> ${this.escapeHtml(this.clienteDocTicket)}</div>` : ''}
    </div>

    <div class="line"></div>
    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th class="c">Cant</th>
          <th class="r">P.Unit</th>
          <th class="r">Desc</th>
          <th class="r">Subt</th>
        </tr>
      </thead>
      <tbody>${detalleRows}</tbody>
    </table>

    <div class="line"></div>
    <div class="totales">
      ${this.comprobante.descuento > 0 ? `<div class="row"><span>Subtotal</span><span>${this.formatMoney(this.comprobante.subtotal)}</span></div>` : ''}
      ${this.comprobante.descuento > 0 ? `<div class="row"><span>Descuento</span><span>- ${this.formatMoney(this.comprobante.descuento)}</span></div>` : ''}
      <div class="row"><span>Base imponible</span><span>${this.formatMoney(this.comprobante.baseImponible)}</span></div>
      <div class="row"><span>IGV (18%)</span><span>${this.formatMoney(this.comprobante.igv)}</span></div>
      <div class="row total"><span>TOTAL</span><span>${this.formatMoney(this.comprobante.total)}</span></div>
    </div>

    <div class="footer">
      <div>Gracias por su compra</div>
      <div>Representación impresa del comprobante</div>
    </div>
  </div>

  <script>
    window.onload = function () {
      window.focus();
      window.print();
    };
    window.onafterprint = function () { window.close(); };
  </script>
</body>
</html>`;

    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  }

  get tipoClass(): string {
    return this.comprobante?.tipo === 'BOLETA' ? 'chip-boleta' : 'chip-factura';
  }

  get metodoPagoClass(): string {
    const m = this.comprobante?.metodoPago ?? '';
    return { EFECTIVO: 'chip-efectivo', YAPE: 'chip-yape', TARJETA: 'chip-tarjeta' }[m] ?? '';
  }

  get tieneCliente(): boolean {
    return !!(this.comprobante?.clienteNombre);
  }

  get clienteNombreTicket(): string {
    if (!this.comprobante) return 'Cliente';
    if (this.comprobante.tipo === 'FACTURA') {
      return this.comprobante.clienteRazonSocial || this.comprobante.clienteNombre || 'Cliente';
    }
    return this.comprobante.clienteNombre || 'Cliente';
  }

  get clienteDocTicket(): string | null {
    if (!this.comprobante) return null;
    if (this.comprobante.tipo === 'FACTURA') {
      return this.comprobante.clienteRuc ? `RUC: ${this.comprobante.clienteRuc}` : null;
    }
    if (this.comprobante.clienteDni) return `DNI: ${this.comprobante.clienteDni}`;
    if (this.comprobante.clienteRuc) return `RUC: ${this.comprobante.clienteRuc}`;
    return null;
  }

  private formatMoney(value: number): string {
    return `S/ ${new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0)}`;
  }

  private formatDate(value: string): string {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(d);
  }

  private escapeHtml(value: unknown): string {
    const text = String(value ?? '').normalize('NFC');
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
