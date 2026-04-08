// src/app/features/marcas/marcas.module.ts
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
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MarcasListComponent }      from './marcas-list/marcas-list.component';
import { MarcaDialogComponent }     from './marca-dialog/marca-dialog.component';

@NgModule({
  declarations: [MarcasListComponent, MarcaDialogComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: MarcasListComponent }]),
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatChipsModule, MatTooltipModule,
  ],
})
export class MarcasModule {}
