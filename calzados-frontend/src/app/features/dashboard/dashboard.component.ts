// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService }    from '../../core/services/auth.service';
import { ReporteService } from '../../core/services/reporte.service';
import { CajaService }    from '../../core/services/caja.service';
import { ProductoService } from '../../core/services/producto.service';
import { AuthUser }       from '../../core/models/auth.model';
import { ResumenDiario, StockBajo, Caja } from '../../core/models/index';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: AuthUser | null = null;
  loading = true;
  today = this.getTodayPeru();

  resumen: ResumenDiario | null = null;
  cajaAbierta: Caja | null = null;
  stockBajo: StockBajo[] = [];

  constructor(
    private authService: AuthService,
    private reporteService: ReporteService,
    private cajaService: CajaService,
    private productoService: ProductoService,
  ) {}

getTodayPeru(): string {
  const now = new Date();

  const peruTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Lima' })
  );

  const year = peruTime.getFullYear();
  const month = String(peruTime.getMonth() + 1).padStart(2, '0');
  const day = String(peruTime.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    const resumen$ = this.authService.isAdmin()
      ? this.reporteService.resumenDiario(this.today).pipe(catchError(() => of(null)))
      : of(null);

    const caja$ = this.cajaService.miCaja().pipe(catchError(() => of(null)));

    const stock$ = this.authService.isAdmin()
      ? this.productoService.stockBajo().pipe(catchError(() => of([])))
      : of([]);

    forkJoin({ resumen: resumen$, caja: caja$, stock: stock$ }).subscribe(({ resumen, caja, stock }) => {
      this.resumen     = resumen as ResumenDiario | null;
      this.cajaAbierta = caja as Caja | null;
      this.stockBajo   = stock as StockBajo[];
      this.loading = false;
    });
  }

  get isAdmin(): boolean { return this.authService.isAdmin(); }
}
