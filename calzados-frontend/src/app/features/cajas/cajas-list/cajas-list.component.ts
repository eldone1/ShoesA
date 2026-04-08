// src/app/features/cajas/cajas-list/cajas-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog }   from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CajaService } from '../../../core/services/caja.service';
import { AuthService } from '../../../core/services/auth.service';
import { Caja }        from '../../../core/models/index';
import { AperturaDialogComponent } from '../apertura-dialog/apertura-dialog.component';
import { CierreDialogComponent }   from '../cierre-dialog/cierre-dialog.component';

@Component({
  selector: 'app-cajas-list',
  templateUrl: './cajas-list.component.html',
  styleUrls: ['./cajas-list.component.scss'],
})
export class CajasListComponent implements OnInit {
  cajas: Caja[] = [];
  cajaAbierta: Caja | null = null;
  loading = false;
  isAdmin: boolean;
  displayedColumns = ['id', 'cajero', 'apertura', 'cierre', 'montoInicial',
                      'totalVentas', 'montoFinalReal', 'diferencia', 'estado', 'acciones'];

  constructor(
    private cajaService: CajaService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {
    this.isAdmin = authService.isAdmin();
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    // Verificar si hay caja abierta
    this.cajaService.miCaja().subscribe({
      next:  c => { this.cajaAbierta = c; this.loadCajas(); },
      error: () => { this.cajaAbierta = null; this.loadCajas(); },
    });
  }

  loadCajas(): void {
    if (this.isAdmin) {
      this.cajaService.listar().subscribe({
        next:  data => { this.cajas = data; this.loading = false; },
        error: ()   => { this.loading = false; },
      });
    } else {
      this.loading = false;
    }
  }

  abrirCaja(): void {
    const ref = this.dialog.open(AperturaDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  cerrarCaja(): void {
    if (!this.cajaAbierta) return;
    const ref = this.dialog.open(CierreDialogComponent, {
      width: '520px', data: this.cajaAbierta,
    });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  diffClass(diff: number): string {
    if (diff > 0) return 'diff-pos';
    if (diff < 0) return 'diff-neg';
    return 'diff-zero';
  }
}
