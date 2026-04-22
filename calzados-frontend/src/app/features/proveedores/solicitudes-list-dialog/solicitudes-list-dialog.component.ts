import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Proveedor, SolicitudCompra, RecepcionDetalleRequest } from '../../../core/models/index';
import { ProveedorService } from '../../../core/services/proveedor.service';

@Component({
  selector: 'app-solicitudes-list-dialog',
  templateUrl: './solicitudes-list-dialog.component.html',
  styleUrls: ['./solicitudes-list-dialog.component.scss'],
})
export class SolicitudesListDialogComponent implements OnInit {
  solicitudes: SolicitudCompra[] = [];
  loading = false;

  constructor(
    private proveedorService: ProveedorService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SolicitudesListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public proveedor: Proveedor,
  ) {}

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  private loadSolicitudes(): void {
    this.loading = true;
    this.proveedorService.listarSolicitudes({ proveedorId: this.proveedor.id }).subscribe({
      next: (solicitudes: SolicitudCompra[]) => {
        this.solicitudes = solicitudes;
        this.loading = false;
      },
      error: (error: any) => {
        this.snack.open('Error al cargar solicitudes', 'OK', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  estadoClass(estado: string): string {
    const estados: { [key: string]: string } = {
      PENDIENTE_RECEPCION: 'estado-pendiente',
      PARCIAL_RECEPCION: 'estado-parcial',
      RECEPCIONADA: 'estado-completado',
      ANULADA: 'estado-anulada',
    };
    return estados[estado] || '';
  }

  togglePagado(solicitud: SolicitudCompra): void {
    if (!solicitud.id) return;

    this.proveedorService.marcarPagado(solicitud.id, !solicitud.pagado).subscribe({
      next: () => {
        solicitud.pagado = !solicitud.pagado;
        this.snack.open(
          solicitud.pagado ? 'Marcado como pagado' : 'Marcado como no pagado',
          'OK',
          { duration: 3000 },
        );
      },
      error: (error: any) => {
        this.snack.open('Error al actualizar pago', 'OK', { duration: 3000 });
      },
    });
  }

  recepcionar(solicitud: SolicitudCompra): void {
    if (!solicitud.detalles || solicitud.detalles.length === 0) {
      this.snack.open('No hay detalles para recepcionar', 'OK', { duration: 3000 });
      return;
    }

    // Abrir dialog de recepción
    const dialogRef = this.dialog.open(RecepcionDialogComponent, {
      width: '600px',
      data: { solicitud, proveedor: this.proveedor },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSolicitudes();
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}

// Dialog para ingresar cantidades de recepción
@Component({
  selector: 'app-recepcion-dialog',
  template: `
    <h2 mat-dialog-title>Recepcionar Mercadería</h2>

    <mat-dialog-content class="recepcion-content">
      <div class="info-header">
        <div><strong>{{ data.solicitud.codigo }}</strong></div>
        <div class="info-sub">{{ data.proveedor.nombre }}</div>
      </div>

      <table mat-table [dataSource]="data.solicitud.detalles" class="detalles-table">
        <ng-container matColumnDef="producto">
          <th mat-header-cell *matHeaderCellDef>Producto / Variante</th>
          <td mat-cell *matCellDef="let d">
            <strong>{{ d.productoNombre }}</strong>
            <br />
            <small>{{ d.varianteSku }} · {{ d.varianteTalla }}/{{ d.varianteColor }}</small>
          </td>
        </ng-container>

        <ng-container matColumnDef="solicitado">
          <th mat-header-cell *matHeaderCellDef>Solicitado</th>
          <td mat-cell *matCellDef="let d">{{ d.cantidadSolicitada }}</td>
        </ng-container>

        <ng-container matColumnDef="recibido">
          <th mat-header-cell *matHeaderCellDef>Recibido</th>
          <td mat-cell *matCellDef="let d">{{ d.cantidadRecibida }}</td>
        </ng-container>

        <ng-container matColumnDef="cantidad">
          <th mat-header-cell *matHeaderCellDef>Cantidad a recibir</th>
          <td mat-cell *matCellDef="let d">
            <mat-form-field appearance="outline" class="input-cantidad">
              <input
                matInput
                type="number"
                min="0"
                [max]="d.cantidadSolicitada - d.cantidadRecibida"
                [(ngModel)]="cantidadesRecepcion[d.id]"
              />
            </mat-form-field>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['producto', 'solicitado', 'recibido', 'cantidad']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['producto', 'solicitado', 'recibido', 'cantidad']"></tr>
      </table>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardarRecepcion()" [disabled]="guardando">
        <mat-icon>check_circle</mat-icon> Registrar recepción
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .recepcion-content {
        min-width: 700px;
        padding: 20px;
      }

      .info-header {
        padding: 12px;
        background-color: #f5f5f5;
        border-left: 4px solid #4caf50;
        margin-bottom: 20px;
        border-radius: 4px;
      }

      .info-sub {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }

      .detalles-table {
        width: 100%;
      }

      .input-cantidad {
        width: 100%;
      }

      mat-dialog-actions {
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
      }
    `,
  ],
})
export class RecepcionDialogComponent implements OnInit {
  cantidadesRecepcion: { [key: number]: number } = {};
  guardando = false;

  constructor(
    private proveedorService: ProveedorService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<RecepcionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { solicitud: SolicitudCompra; proveedor: Proveedor },
  ) {}

  ngOnInit(): void {
    // Inicializar con cantidades actuales
    if (this.data.solicitud.detalles) {
      this.data.solicitud.detalles.forEach(d => {
        this.cantidadesRecepcion[d.id] = 0;
      });
    }
  }

  guardarRecepcion(): void {
    const detalles: RecepcionDetalleRequest[] = this.data.solicitud.detalles
      .filter(d => this.cantidadesRecepcion[d.id] > 0)
      .map(d => ({
        detalleId: d.id,
        cantidadRecibida: this.cantidadesRecepcion[d.id],
      }));

    if (detalles.length === 0) {
      this.snack.open('Debe ingresar al menos una cantidad', 'OK', { duration: 3000 });
      return;
    }

    this.guardando = true;
    this.proveedorService.recepcionar(this.data.solicitud.id, { detalles }).subscribe({
      next: () => {
        this.snack.open('Recepción registrada correctamente', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        this.snack.open('Error al registrar recepción', 'OK', { duration: 3000 });
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
