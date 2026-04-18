// src/app/features/clientes/clientes.module.ts
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
import { MatDialogModule }          from '@angular/material/dialog';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule }           from '@angular/material/chips';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatSlideToggleModule }     from '@angular/material/slide-toggle';
import { MatDividerModule }         from '@angular/material/divider';
import { ClientesListComponent }    from './clientes-list/clientes-list.component';
import { ClienteDialogComponent }   from './cliente-dialog/cliente-dialog.component';

@NgModule({
  declarations: [ClientesListComponent, ClienteDialogComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild([{ path: '', component: ClientesListComponent }]),
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatChipsModule, MatTooltipModule,
    MatSlideToggleModule, MatDividerModule,
  ],
  exports: [ClienteDialogComponent],
})
export class ClientesModule {}
