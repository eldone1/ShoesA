import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Gasto, ResumenGastosMes } from '../../../core/models/index';
import { GastoService } from '../../../core/services/gasto.service';
import { GastoDialogComponent } from '../gasto-dialog/gasto-dialog.component';

@Component({
  selector: 'app-gastos-list',
  templateUrl: './gastos-list.component.html',
  styleUrls: ['./gastos-list.component.scss'],
})
export class GastosListComponent implements OnInit {
  gastos: Gasto[] = [];
  resumen: ResumenGastosMes | null = null;

  loading = false;
  loadingResumen = false;

  year: number;
  month: number;

  displayedColumns = ['fecha', 'tipo', 'concepto', 'monto', 'usuario'];

  constructor(
    private gastoService: GastoService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {
    const now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth() + 1;
  }

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargarResumen();
    this.cargarGastos();
  }

  cargarResumen(): void {
    this.loadingResumen = true;
    this.gastoService.resumenMes(this.year, this.month).subscribe({
      next: data => {
        this.resumen = data;
        this.loadingResumen = false;
      },
      error: () => {
        this.loadingResumen = false;
        this.snack.open('No se pudo cargar el resumen mensual', 'OK', { duration: 3500, panelClass: 'snack-error' });
      },
    });
  }

  cargarGastos(): void {
    this.loading = true;
    this.gastoService.listarMes(this.year, this.month).subscribe({
      next: data => {
        this.gastos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los gastos', 'OK', { duration: 3500, panelClass: 'snack-error' });
      },
    });
  }

  openNuevoGasto(): void {
    const ref = this.dialog.open(GastoDialogComponent, {
      width: '620px',
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.cargarTodo();
      }
    });
  }

  monthLabel(month: number): string {
    return new Date(this.year, month - 1, 1).toLocaleDateString('es-PE', { month: 'long' });
  }

  get saldoClass(): string {
    const saldo = this.resumen?.saldoMes ?? 0;
    return saldo >= 0 ? 'ok' : 'warn';
  }
}
