// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolesPipe } from './pipes/soles.pipe';

@NgModule({
  declarations: [SolesPipe],
  imports: [CommonModule],
  exports: [SolesPipe],
})
export class SharedModule {}
