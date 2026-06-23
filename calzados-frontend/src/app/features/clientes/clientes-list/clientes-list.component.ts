// src/app/features/clientes/clientes-list/clientes-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog }    from '@angular/material/dialog';
import { MatSnackBar }  from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { ClienteService } from '../../../core/services/cliente.service';
import { AuthService } from '../../../core/services/auth.service';
import { ComprobanteService } from '../../../core/services/comprobante.service';
import { Cliente, ComprobanteResponse } from '../../../core/models/index';
import { ClienteDialogComponent } from '../cliente-dialog/cliente-dialog.component';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss'],
})
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  busqueda = '';

  page = 0;
  pageSize = 25;
  totalElements = 0;

  displayedColumns = ['nombre', 'dni', 'ruc', 'telefono', 'email', 'estado', 'acciones'];

  // Panel lateral de historial
  clienteSeleccionado: Cliente | null = null;
  historial: ComprobanteResponse[] = [];
  loadingHistorial = false;

  constructor(
    private clienteService: ClienteService,
    private comprobanteService: ComprobanteService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private authService: AuthService,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.page = 0;
    const q = this.busqueda.trim();

    if (q) {
      this.clienteService.buscar(q, this.page, this.pageSize).subscribe({
        next: p => { this.clientes = p.content; this.totalElements = p.totalElements; this.loading = false; },
        error: () => { this.loading = false; },
      });
      return;
    }

    // Si es CAJERO no mostrar el listado completo — esperar a que busque
    if (this.authService.isCajero()) {
      this.clientes = [];
      this.totalElements = 0;
      this.loading = false;
      return;
    }

    this.clienteService.listar(this.page, this.pageSize).subscribe({
      next: p => { this.clientes = p.content; this.totalElements = p.totalElements; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onPageChange(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loading = true;
    const q = this.busqueda.trim();
    if (q) {
      this.clienteService.buscar(q, this.page, this.pageSize).subscribe({
        next: p => { this.clientes = p.content; this.totalElements = p.totalElements; this.loading = false; },
        error: () => { this.loading = false; },
      });
    } else {
      this.clienteService.listar(this.page, this.pageSize).subscribe({
        next: p => { this.clientes = p.content; this.totalElements = p.totalElements; this.loading = false; },
        error: () => { this.loading = false; },
      });
    }
  }

  openDialog(cliente?: Cliente): void {
    const ref = this.dialog.open(ClienteDialogComponent, {
      width: '560px', data: cliente ?? null,
    });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  toggleEstado(cliente: Cliente): void {
    const nuevo = !cliente.activo;
    this.clienteService.cambiarEstado(cliente.id, nuevo).subscribe({
      next: () => {
        cliente.activo = nuevo;
        this.snack.open(`Cliente ${nuevo ? 'activado' : 'desactivado'}`, 'OK',
          { duration: 3000, panelClass: 'snack-success' });
      },
      error: e => this.snack.open(e?.error?.message ?? 'Error', 'OK',
        { duration: 4000, panelClass: 'snack-error' }),
    });
  }

  verHistorial(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.loadingHistorial = true;
    this.comprobanteService.listarPorCliente(cliente.id).subscribe({
      next:  data => { this.historial = data; this.loadingHistorial = false; },
      error: ()   => { this.loadingHistorial = false; },
    });
  }

  cerrarHistorial(): void {
    this.clienteSeleccionado = null;
    this.historial = [];
  }
}
