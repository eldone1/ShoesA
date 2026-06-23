import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Gasto, ResumenGastosMes } from '../../../core/models/index';
import { GastoService } from '../../../core/services/gasto.service';
import { ExportService } from '../../../core/services/export.service';
import { GastoDialogComponent } from '../gasto-dialog/gasto-dialog.component';
import { DatePeruService } from '../../../core/services/date-peru.service';
import { ConfirmService } from '../../../core/services/confirm.service';

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

  page = 0;
  pageSize = 25;
  totalElements = 0;

  displayedColumns = ['fecha', 'tipo', 'concepto', 'monto', 'usuario', 'acciones'];

  constructor(
    private gastoService: GastoService,
    private exportService: ExportService,
    private datePeruService: DatePeruService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: ConfirmService,
  ) {
    const current = this.datePeruService.getCurrentYearMonth();
    this.year = current.year;
    this.month = current.month;
  }

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargarResumen();
    this.page = 0;
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
    this.gastoService.listarMes(this.year, this.month, this.page, this.pageSize).subscribe({
      next: p => {
        this.gastos = p.content;
        this.totalElements = p.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los gastos', 'OK', { duration: 3500, panelClass: 'snack-error' });
      },
    });
  }

  onPageChange(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.cargarGastos();
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

  editarGasto(gasto: Gasto): void {
    const ref = this.dialog.open(GastoDialogComponent, {
      width: '620px',
      data: gasto,
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.cargarTodo();
      }
    });
  }

  eliminarGasto(gasto: Gasto): void {
    this.confirmService.delete(gasto.concepto).subscribe((ok: boolean) => {
      if (ok) {
        this.gastoService.eliminar(gasto.id).subscribe({
          next: () => {
            this.snack.open('Gasto eliminado', 'OK', { duration: 3000, panelClass: 'snack-success' });
            this.cargarTodo();
          },
          error: () => {
            this.snack.open('No se pudo eliminar el gasto', 'OK', { duration: 3500, panelClass: 'snack-error' });
          },
        });
      }
    });
  }

  moverAOtroMes(gasto: Gasto): void {
    const ref = this.dialog.open(GastoDialogComponent, {
      width: '620px',
      data: gasto,
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.cargarTodo();
      }
    });
  }

  descargarGastos(): void {
    if (this.gastos.length === 0) {
      this.snack.open('No hay gastos para descargar', 'OK', { duration: 3000 });
      return;
    }
    this.exportService.exportarGastos(this.gastos, this.year, this.month);
    this.snack.open('Descarga generada', 'OK', { duration: 2500 });
  }

  monthLabel(month: number): string {
    return new Date(this.year, month - 1, 1).toLocaleDateString('es-PE', { month: 'long' });
  }

  get saldoClass(): string {
    const saldo = this.resumen?.saldoMes ?? 0;
    return saldo >= 0 ? 'ok' : 'warn';
  }
}
