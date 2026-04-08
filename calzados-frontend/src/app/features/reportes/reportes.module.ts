// src/app/features/reportes/reportes.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule }            from '@angular/material/card';
import { MatTableModule }           from '@angular/material/table';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule }            from '@angular/material/tabs';
import { MatDividerModule }         from '@angular/material/divider';
import { MatChipsModule }           from '@angular/material/chips';
import { ReportesComponent }        from './reportes.component';

@NgModule({
  declarations: [ReportesComponent],
  imports: [
    CommonModule, FormsModule,
    RouterModule.forChild([{ path: '', component: ReportesComponent }]),
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule,
    MatTabsModule, MatDividerModule, MatChipsModule,
  ],
})
export class ReportesModule {}
