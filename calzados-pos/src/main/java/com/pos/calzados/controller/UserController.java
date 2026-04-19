package com.pos.calzados.controller;

import com.pos.calzados.dto.request.UserRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.UserResponse;
import com.pos.calzados.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    /** GET /api/users */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> listar() {
        return ResponseEntity.ok(ApiResponse.ok(userService.listar()));
    }

    /** GET /api/users/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.obtenerPorId(id)));
    }

    /** POST /api/users */
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> crear(@Valid @RequestBody UserRequest request) {
        UserResponse response = userService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Usuario creado exitosamente", response));
    }

    /** PUT /api/users/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Usuario actualizado", userService.actualizar(id, request)));
    }

    /** PATCH /api/users/{id}/estado?activo=false */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<Void>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam boolean activo) {
        userService.cambiarEstado(id, activo);
        String msg = activo ? "Usuario activado" : "Usuario desactivado";
        return ResponseEntity.ok(ApiResponse.ok(msg, null));
    }
}
