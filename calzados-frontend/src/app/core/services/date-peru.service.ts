import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DatePeruService {
  private readonly timeZone = 'America/Lima';

  getToday(): string {
    const peruNow = this.getPeruNow();
    const year = peruNow.getFullYear();
    const month = String(peruNow.getMonth() + 1).padStart(2, '0');
    const day = String(peruNow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getCurrentYearMonth(): { year: number; month: number } {
    const peruNow = this.getPeruNow();
    return {
      year: peruNow.getFullYear(),
      month: peruNow.getMonth() + 1,
    };
  }

  toLocaleString(): string {
    return new Date().toLocaleString('es-PE', { timeZone: this.timeZone });
  }

  private getPeruNow(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: this.timeZone }));
  }
}