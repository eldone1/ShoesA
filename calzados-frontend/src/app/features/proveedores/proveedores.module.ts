import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { ProveedoresListComponent } from './proveedores-list/proveedores-list.component';
import { ProveedorDialogComponent } from './proveedor-dialog/proveedor-dialog.component';
import { SolicitudCompraDialogComponent } from './solicitud-compra-dialog/solicitud-compra-dialog.component';
import { SolicitudesListDialogComponent, RecepcionDialogComponent } from './solicitudes-list-dialog/solicitudes-list-dialog.component';

@NgModule({
  declarations: [
    ProveedoresListComponent,
    ProveedorDialogComponent,
    SolicitudCompraDialogComponent,
    SolicitudesListDialogComponent,
    RecepcionDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ProveedoresListComponent }]),
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSelectModule,
    MatExpansionModule,
  ],
})
export class ProveedoresModule {}
