// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse, AuthUser } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'calzados_token';
  private readonly USER_KEY  = 'calzados_user';
  private readonly API       = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Login ────────────────────────────────────────────────────────────────────
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API}/login`, request).pipe(
      map(res => res.data),
      tap(data => {
        localStorage.setItem(this.TOKEN_KEY, data.token);
        const user: AuthUser = {
          userId: data.userId,
          nombre: data.nombre,
          email:  data.email,
          rol:    data.rol,
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // ── Logout ───────────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // ── Getters ──────────────────────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.rol === 'ADMIN';
  }

  isCajero(): boolean {
    return this.getCurrentUser()?.rol === 'CAJERO';
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
