// src/app/features/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Bienvenido al sistema', 'Cerrar', {
          duration: 3000, panelClass: 'snack-success',
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message ?? 'Credenciales incorrectas';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000, panelClass: 'snack-error' });
      },
    });
  }

  get emailError(): string {
    const c = this.form.get('email')!;
    if (c.hasError('required')) return 'El email es requerido';
    if (c.hasError('email'))    return 'Ingresa un email válido';
    return '';
  }
}
