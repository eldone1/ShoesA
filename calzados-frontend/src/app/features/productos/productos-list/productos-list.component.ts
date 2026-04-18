// src/app/features/productos/productos-list/productos-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog }    from '@angular/material/dialog';
import { MatSnackBar }  from '@angular/material/snack-bar';
import { ProductoService } from '../../../core/services/producto.service';
import { MarcaService }    from '../../../core/services/marca.service';
import { AuthService }     from '../../../core/services/auth.service';
import { ExportService }   from '../../../core/services/export.service';
import { Producto, Marca } from '../../../core/models/index';
import { ProductoDialogComponent } from '../producto-dialog/producto-dialog.component';

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.component.html',
  styleUrls: ['./productos-list.component.scss'],
})
export class ProductosListComponent implements OnInit {
  productos: Producto[] = [];
  marcas: Marca[] = [];
  loading = false;
  exportando = false;
  isAdmin: boolean;

  filtroNombre = '';
  filtroCodigo = '';
  filtroMarca: number | null = null;
  expandedId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private authService: AuthService,
    private exportService: ExportService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {
    this.isAdmin = authService.isAdmin();
  }

  ngOnInit(): void {
    this.marcaService.listar().subscribe((m: any) => this.marcas = m);
    this.load();
  }

  load(): void {
    this.loading = true;

    const codigo = this.filtroCodigo.trim();
    if (codigo) {
      this.buscarPorCodigo(codigo);
      return;
    }

    this.productoService.buscar(
      this.filtroNombre || undefined,
      this.filtroMarca  || undefined,
    ).subscribe({
      next:  data => { this.productos = data; this.loading = false; },
      error: ()   => { this.loading = false; },
    });
  }

  private buscarPorCodigo(codigo: string): void {
    this.productoService.scanearCodigoBarras(codigo).subscribe({
      next: variante => {
        this.productoService.buscar(
          variante.productoNombre || undefined,
          this.filtroMarca || undefined,
        ).subscribe({
          next: data => {
            this.productos = data.filter(p =>
              (p.variantes ?? []).some(v => v.codigoBarras === codigo),
            );

            this.expandedId = this.productos.length === 1 ? this.productos[0].id : null;
            this.loading = false;

            if (this.productos.length === 0) {
              this.snack.open(`No se encontró producto para el código ${codigo}`, 'OK', {
                duration: 3000,
                panelClass: 'snack-warn',
              });
            }
          },
          error: () => { this.loading = false; },
        });
      },
      error: () => {
        this.productos = [];
        this.expandedId = null;
        this.loading = false;
        this.snack.open(`Código no encontrado: ${codigo}`, 'OK', {
          duration: 3000,
          panelClass: 'snack-error',
        });
      },
    });
  }

  /* openDialog(producto?: Producto): void {
    const ref = this.dialog.open(ProductoDialogComponent, {
      width: '720px', maxHeight: '90vh',
      data: { producto: producto ?? null, marcas: this.marcas },
    });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  } */

    openDialog(producto?: Producto): void {
  const ref = this.dialog.open(ProductoDialogComponent, {
    width: '720px',
    maxHeight: '90vh',
    data: { producto: producto ?? null, marcas: this.marcas },
  });

  ref.afterClosed().subscribe(result => {
    if (result === true) { // 🔥 explícito
      this.load();         // 🔥 refresca SIEMPRE
    }
  });
}

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.productoService.eliminar(p.id).subscribe({
      next: () => { this.snack.open('Producto eliminado', 'OK', { duration: 3000, panelClass: 'snack-success' }); this.load(); },
      error: e => this.snack.open(e?.error?.message ?? 'Error', 'OK', { duration: 4000, panelClass: 'snack-error' }),
    });
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroCodigo = '';
    this.filtroMarca = null;
    this.expandedId = null;
    this.load();
  }

  // ── Exportar Excel ────────────────────────────────────────────────────────
  exportarExcel(): void {
    if (this.productos.length === 0) {
      this.snack.open('No hay productos para exportar', 'OK', { duration: 3000 });
      return;
    }
    this.exportando = true;
    try {
      this.exportService.exportarProductos(this.productos);
      this.snack.open('Excel descargado correctamente', 'OK', { duration: 3000, panelClass: 'snack-success' });
    } catch (e) {
      this.snack.open('Error al generar el Excel', 'OK', { duration: 3000, panelClass: 'snack-error' });
    } finally {
      this.exportando = false;
    }
  }
}
