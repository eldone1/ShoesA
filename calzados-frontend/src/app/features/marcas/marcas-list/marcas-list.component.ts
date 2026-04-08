// src/app/features/marcas/marcas-list/marcas-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog }    from '@angular/material/dialog';
import { MatSnackBar }  from '@angular/material/snack-bar';
import { MarcaService } from '../../../core/services/marca.service';
import { Marca }        from '../../../core/models/index';
import { MarcaDialogComponent } from '../marca-dialog/marca-dialog.component';

@Component({
  selector: 'app-marcas-list',
  templateUrl: './marcas-list.component.html',
  styleUrls: ['./marcas-list.component.scss'],
})
export class MarcasListComponent implements OnInit {
  marcas: Marca[] = [];
  loading = false;
  displayedColumns = ['id', 'nombre', 'estado', 'acciones'];

  constructor(
    private marcaService: MarcaService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.marcaService.listarTodas().subscribe({
      next: data => { this.marcas = data; this.loading = false; },
      error: ()   => { this.loading = false; },
    });
  }

  openDialog(marca?: Marca): void {
    const ref = this.dialog.open(MarcaDialogComponent, {
      width: '420px', data: marca ?? null,
    });
    ref.afterClosed().subscribe(result => { if (result) this.load(); });
  }

  eliminar(marca: Marca): void {
    if (!confirm(`¿Eliminar la marca "${marca.nombre}"?`)) return;
    this.marcaService.eliminar(marca.id).subscribe({
      next: () => { this.snack.open('Marca eliminada', 'OK', { duration: 3000, panelClass: 'snack-success' }); this.load(); },
      error: (e) => this.snack.open(e?.error?.message ?? 'Error al eliminar', 'OK', { duration: 4000, panelClass: 'snack-error' }),
    });
  }
}
