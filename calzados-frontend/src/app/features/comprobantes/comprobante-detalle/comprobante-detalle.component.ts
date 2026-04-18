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

    const popup = window.open('', '_blank', 'noopener,noreferrer,width=420,height=900');
    if (!popup) {
      // Fallback si el navegador bloquea popups.
      document.body.classList.add('printing-ticket');
      window.print();
      setTimeout(() => document.body.classList.remove('printing-ticket'), 500);
      return;
    }

    const detalleRows = (this.comprobante.detalles ?? []).map((d: any) => `
      <tr>
        <td>
          <div class="nombre">${this.escapeHtml(d.productoNombre ?? '')}</div>
          <div class="det">T: ${this.escapeHtml(d.talla ?? '')} - ${this.escapeHtml(d.color ?? '')}</div>
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
  <title>Ticket ${this.escapeHtml(this.comprobante.serie)}</title>
  <style>
    @page { size: 80mm auto; margin: 4mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Courier New", monospace;
      color: #111;
      background: #fff;
      display: flex;
      justify-content: center;
    }
    .ticket { width: 72mm; padding: 0; font-size: 11px; }
    .head { display: flex; justify-content: space-between; align-items: flex-start; }
    .empresa { font-weight: 700; font-size: 18px; }
    .sub { font-size: 11px; color: #666; }
    .serie {
      border: 1px solid #222; border-radius: 4px; padding: 4px 6px;
      text-align: center; font-size: 10px; font-weight: 700;
    }
    .serie-num { font-size: 12px; margin-top: 2px; }
    .line { border-top: 1px dashed #888; margin: 8px 0; }
    .lbl { font-size: 10px; color: #666; text-transform: uppercase; }
    .val { font-size: 11px; font-weight: 700; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { text-align: left; border-bottom: 1px solid #bbb; padding: 4px 2px; }
    td { border-bottom: 1px solid #eee; padding: 5px 2px; vertical-align: top; }
    .nombre { font-weight: 700; }
    .det { color: #666; }
    .c { text-align: center; width: 28px; }
    .r { text-align: right; white-space: nowrap; }
    .total { font-weight: 700; }
    .totales { margin-top: 6px; }
    .row { display: flex; justify-content: space-between; padding: 2px 0; }
    .row.total { font-size: 12px; font-weight: 800; }
    .footer { text-align: center; margin-top: 10px; border-top: 1px dashed #888; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="head">
      <div>
        <div class="empresa">CALZADOS POS</div>
        <div class="sub">Sistema de Punto de Venta</div>
      </div>
      <div class="serie">
        ${this.escapeHtml(this.comprobante.tipo)}
        <div class="serie-num">${this.escapeHtml(this.comprobante.serie)}</div>
      </div>
    </div>

    <div class="line"></div>
    <div class="lbl">Fecha Emision</div>
    <div class="val">${this.escapeHtml(this.formatDate(this.comprobante.fechaEmision))}</div>
    <div class="lbl">Cajero</div>
    <div class="val">${this.escapeHtml(this.comprobante.cajeroNombre)}</div>
    <div class="lbl">Metodo de Pago</div>
    <div class="val">${this.escapeHtml(this.comprobante.metodoPago)}</div>

    <div class="line"></div>
    <div class="lbl">Cliente</div>
    <div class="val">${this.escapeHtml(this.clienteNombreTicket)}</div>
    ${this.clienteDocTicket ? `<div class="val">${this.escapeHtml(this.clienteDocTicket)}</div>` : ''}

    <div class="line"></div>
    <div class="lbl" style="margin-bottom:4px">Detalle de la Venta</div>
    <table>
      <thead>
        <tr>
          <th>Descripcion</th>
          <th class="c">Cant.</th>
          <th class="r">P. Unit.</th>
          <th class="r">Desc.</th>
          <th class="r">Subtotal</th>
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
      <div class="line"></div>
      <div class="row total"><span>TOTAL</span><span>${this.formatMoney(this.comprobante.total)}</span></div>
    </div>

    <div class="footer">Gracias por su compra</div>
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

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
