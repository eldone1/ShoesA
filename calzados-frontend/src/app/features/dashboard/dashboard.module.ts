// src/app/features/dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule }            from '@angular/material/card';
import { MatIconModule }            from '@angular/material/icon';
import { MatButtonModule }          from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule }         from '@angular/material/divider';
import { MatChipsModule }           from '@angular/material/chips';
import { DashboardComponent }       from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
    MatCardModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatDividerModule, MatChipsModule,
  ],
})
export class DashboardModule {}
