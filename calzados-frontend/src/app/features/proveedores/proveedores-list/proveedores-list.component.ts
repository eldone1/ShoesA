import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Proveedor } from '../../../core/models/index';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { ProveedorDialogComponent } from '../proveedor-dialog/proveedor-dialog.component';
import { SolicitudCompraDialogComponent } from '../solicitud-compra-dialog/solicitud-compra-dialog.component';
import { SolicitudesListDialogComponent } from '../solicitudes-list-dialog/solicitudes-list-dialog.component';

@Component({
  selector: 'app-proveedores-list',
  templateUrl: './proveedores-list.component.html',
  styleUrls: ['./proveedores-list.component.scss'],
})
export class ProveedoresListComponent implements OnInit {
  proveedores: Proveedor[] = [];
  loading = false;
  filtroQ = '';
  incluirInactivos = false;

  displayedColumns = ['nombre', 'ruc', 'contacto', 'telefono', 'estado', 'acciones'];

  constructor(
    private proveedorService: ProveedorService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.loading = true;
    this.proveedorService.listar(this.incluirInactivos, this.filtroQ).subscribe({
      next: data => {
        this.proveedores = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar proveedores', 'OK', { duration: 3000, panelClass: 'snack-error' });
      },
    });
  }

  openDialog(proveedor?: Proveedor): void {
    const ref = this.dialog.open(ProveedorDialogComponent, {
      width: '700px',
      data: proveedor ?? null,
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.loadProveedores();
      }
    });
  }

  abrirCrearSolicitud(proveedor: Proveedor): void {
    const ref = this.dialog.open(SolicitudCompraDialogComponent, {
      width: '900px',
      data: proveedor,
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        // Recargar si fue exitoso
      }
    });
  }

  abrirSolicitudes(proveedor: Proveedor): void {
    this.dialog.open(SolicitudesListDialogComponent, {
      width: '1000px',
      data: proveedor,
    });
  }

  toggleEstado(proveedor: Proveedor): void {
    const nuevoEstado = !proveedor.activo;
    this.proveedorService.cambiarEstado(proveedor.id, nuevoEstado).subscribe({
      next: () => {
        proveedor.activo = nuevoEstado;
        this.snack.open(`Proveedor ${nuevoEstado ? 'activado' : 'desactivado'}`, 'OK', {
          duration: 3000,
          panelClass: 'snack-success',
        });
      },
      error: e => {
        this.snack.open(e?.error?.message ?? 'No se pudo cambiar estado', 'OK', {
          duration: 4000,
          panelClass: 'snack-error',
        });
      },
    });
  }
}
