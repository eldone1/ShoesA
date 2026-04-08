// src/app/features/usuarios/usuarios-list/usuarios-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog }   from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { User }        from '../../../core/models/index';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss'],
})
export class UsuariosListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  cols = ['id', 'nombre', 'email', 'rol', 'estado', 'acciones'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.userService.listar().subscribe({
      next:  data => { this.users = data; this.loading = false; },
      error: ()   => { this.loading = false; },
    });
  }

  openDialog(user?: User): void {
    const ref = this.dialog.open(UsuarioDialogComponent, { width: '480px', data: user ?? null });
    ref.afterClosed().subscribe(r => { if (r) this.load(); });
  }

  toggleEstado(user: User): void {
    const nuevoEstado = !user.activo;
    this.userService.cambiarEstado(user.id, nuevoEstado).subscribe({
      next: () => {
        user.activo = nuevoEstado;
        this.snack.open(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'}`, 'OK', { duration: 3000, panelClass: 'snack-success' });
      },
      error: e => this.snack.open(e?.error?.message ?? 'Error', 'OK', { duration: 4000, panelClass: 'snack-error' }),
    });
  }
}
