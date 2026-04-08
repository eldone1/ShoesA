// src/app/features/cajas/cajas.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule }            from '@angular/material/card';
import { MatTableModule }           from '@angular/material/table';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatDialogModule }          from '@angular/material/dialog';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule }           from '@angular/material/chips';
import { MatDividerModule }         from '@angular/material/divider';
import { MatDatepickerModule }      from '@angular/material/datepicker';
import { MatNativeDateModule }      from '@angular/material/core';
import { CajasListComponent }       from './cajas-list/cajas-list.component';
import { AperturaDialogComponent }  from './apertura-dialog/apertura-dialog.component';
import { CierreDialogComponent }    from './cierre-dialog/cierre-dialog.component';

@NgModule({
  declarations: [CajasListComponent, AperturaDialogComponent, CierreDialogComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: CajasListComponent }]),
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatChipsModule, MatDividerModule,
    MatDatepickerModule, MatNativeDateModule,
  ],
})
export class CajasModule {}
