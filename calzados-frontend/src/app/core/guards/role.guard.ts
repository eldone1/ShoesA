// src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRoles: string[] = route.data['roles'] ?? [];
    const userRol = this.authService.getCurrentUser()?.rol;

    if (!userRol || !requiredRoles.includes(userRol)) {
      return this.router.createUrlTree(['/dashboard']);
    }
    return true;
  }
}
