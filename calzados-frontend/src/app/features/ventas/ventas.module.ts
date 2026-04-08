// src/app/features/ventas/ventas.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule }            from '@angular/material/card';
import { MatTableModule }           from '@angular/material/table';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatSelectModule }          from '@angular/material/select';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule }           from '@angular/material/chips';
import { MatDividerModule }         from '@angular/material/divider';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatDatepickerModule }      from '@angular/material/datepicker';
import { MatNativeDateModule }      from '@angular/material/core';
import { NuevaVentaComponent }      from './nueva-venta/nueva-venta.component';
import { VentasListComponent }      from './ventas-list/ventas-list.component';

const routes: Routes = [
  { path: '',         component: VentasListComponent },
  { path: 'nueva',    component: NuevaVentaComponent },
  { path: 'caja/:id', component: VentasListComponent },
];

@NgModule({
  declarations: [NuevaVentaComponent, VentasListComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild(routes),
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatChipsModule, MatDividerModule,
    MatTooltipModule, MatDatepickerModule, MatNativeDateModule,
  ],
})
export class VentasModule {}
