// src/app/features/productos/productos-list/productos-list.component.ts
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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

  page = 0;
  pageSize = 25;
  totalElements = 0;

  filtroNombre = '';
  filtroCodigo = '';
  filtroMarca: number | null = null;
  expandedId: number | null = null;
  codigoBarrasResaltado: string | null = null;

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
    this.page = 0;

    const codigo = this.filtroCodigo.trim();
    if (codigo) {
      this.buscarPorCodigo(codigo);
      return;
    }

    this.codigoBarrasResaltado = null;

    this.productoService.buscar(
      this.filtroNombre || undefined,
      this.filtroMarca  || undefined,
      this.page,
      this.pageSize,
    ).subscribe({
      next:  p => { this.productos = p.content; this.totalElements = p.totalElements; this.loading = false; },
      error: ()   => { this.loading = false; },
    });
  }

  onPageChange(e: PageEvent): void {
    this.page = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loading = true;

    const codigo = this.filtroCodigo.trim();
    if (codigo) {
      this.buscarPorCodigo(codigo);
      return;
    }

    this.productoService.buscar(
      this.filtroNombre || undefined,
      this.filtroMarca  || undefined,
      this.page,
      this.pageSize,
    ).subscribe({
      next:  p => { this.productos = p.content; this.totalElements = p.totalElements; this.loading = false; },
      error: ()   => { this.loading = false; },
    });
  }

  private buscarPorCodigo(codigo: string): void {
    this.codigoBarrasResaltado = codigo;
    this.productoService.scanearCodigoBarras(codigo).subscribe({
      next: variante => {
        const productoId = (variante as any).productoId;
        if (productoId) {
          this.productoService.obtener(productoId).subscribe({
            next: p => {
              this.productos = [p];
              this.totalElements = 1;
              this.expandedId = p.id;
              this.loading = false;
            },
            error: () => {
              this.productos = [];
              this.totalElements = 0;
              this.loading = false;
              this.snack.open(`Error al obtener producto para el código ${codigo}`, 'OK', {
                duration: 3000,
                panelClass: 'snack-error',
              });
            },
          });
        } else {
          this.productos = [];
          this.totalElements = 0;
          this.loading = false;
          this.snack.open(`Código no encontrado: ${codigo}`, 'OK', {
            duration: 3000,
            panelClass: 'snack-error',
          });
        }
      },
      error: () => {
        this.productos = [];
        this.totalElements = 0;
        this.codigoBarrasResaltado = null;
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
    this.codigoBarrasResaltado = null;
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

  formatPorcentajeEnSoles(precioBase: number, porcentaje: number): string {
    const pct = Number(porcentaje) || 0;
    const base = Number(precioBase) || 0;
    const monto = base * (pct / 100);
    return `${pct}% - S/ ${monto.toFixed(2)}`;
  }
}
