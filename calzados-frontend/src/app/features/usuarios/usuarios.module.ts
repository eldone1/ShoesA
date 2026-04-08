// src/app/features/usuarios/usuarios.module.ts
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
import { MatSelectModule }          from '@angular/material/select';
import { MatDialogModule }          from '@angular/material/dialog';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule }           from '@angular/material/chips';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatSlideToggleModule }     from '@angular/material/slide-toggle';
import { UsuariosListComponent }    from './usuarios-list/usuarios-list.component';
import { UsuarioDialogComponent }   from './usuario-dialog/usuario-dialog.component';

@NgModule({
  declarations: [UsuariosListComponent, UsuarioDialogComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: UsuariosListComponent }]),
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatChipsModule,
    MatTooltipModule, MatSlideToggleModule,
  ],
})
export class UsuariosModule {}
