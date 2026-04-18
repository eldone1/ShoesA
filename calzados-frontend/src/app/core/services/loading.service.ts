// src/app/core/services/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private count = 0;
  private subject = new BehaviorSubject<boolean>(false);
  loading$ = this.subject.asObservable();

  show(): void {
    this.count++;
    this.subject.next(true);
  }

  hide(): void {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) this.subject.next(false);
  }
}
