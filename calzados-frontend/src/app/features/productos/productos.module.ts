// src/app/features/productos/productos.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule }            from '@angular/material/card';
import { MatTableModule }           from '@angular/material/table';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatSelectModule }          from '@angular/material/select';
import { MatDialogModule }          from '@angular/material/dialog';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule }           from '@angular/material/chips';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatDividerModule }         from '@angular/material/divider';
import { MatTabsModule }            from '@angular/material/tabs';
import { MatExpansionModule }       from '@angular/material/expansion';
import { ProductosListComponent }   from './productos-list/productos-list.component';
import { ProductoDialogComponent }  from './producto-dialog/producto-dialog.component';

@NgModule({
  declarations: [ProductosListComponent, ProductoDialogComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild([{ path: '', component: ProductosListComponent }]),
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatChipsModule,
    MatTooltipModule, MatDividerModule, MatTabsModule, MatExpansionModule,
  ],
})
export class ProductosModule {}
