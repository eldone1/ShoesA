// src/app/shared/pipes/soles.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'soles' })
export class SolesPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals: number = 2): string {
    if (value == null || isNaN(value)) return 'S/ 0.00';
    return `S/ ${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
}
