// src/app/features/comprobantes/comprobantes.module.ts
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
import { MatDialogModule }          from '@angular/material/dialog';
import { MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule }           from '@angular/material/chips';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatDividerModule }         from '@angular/material/divider';
import { MatAutocompleteModule }    from '@angular/material/autocomplete';
import { ComprobantesListComponent }  from './comprobantes-list/comprobantes-list.component';
import { ComprobanteDetalleComponent } from './comprobante-detalle/comprobante-detalle.component';
import { EmitirComprobanteDialogComponent } from './emitir-comprobante-dialog/emitir-comprobante-dialog.component';

const routes: Routes = [
  { path: '',    component: ComprobantesListComponent },
  { path: ':id', component: ComprobanteDetalleComponent },
];

@NgModule({
  declarations: [
    ComprobantesListComponent,
    ComprobanteDetalleComponent,
    EmitirComprobanteDialogComponent,
  ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild(routes),
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatChipsModule,
    MatTooltipModule, MatDividerModule, MatAutocompleteModule,
  ],
  exports: [EmitirComprobanteDialogComponent],
})
export class ComprobantesModule {}
