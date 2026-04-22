package com.pos.calzados.controller;

import com.pos.calzados.dto.request.ProveedorRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.ProveedorResponse;
import com.pos.calzados.service.ProveedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ProveedorController {

    private final ProveedorService proveedorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProveedorResponse>>> listar(
            @RequestParam(required = false) Boolean incluirInactivos,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(ApiResponse.ok(proveedorService.listar(incluirInactivos, q)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProveedorResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(proveedorService.obtenerPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProveedorResponse>> crear(@Valid @RequestBody ProveedorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Proveedor creado exitosamente", proveedorService.crear(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProveedorResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProveedorRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Proveedor actualizado", proveedorService.actualizar(id, request)));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<Void>> cambiarEstado(@PathVariable Long id, @RequestParam boolean activo) {
        proveedorService.cambiarEstado(id, activo);
        String msg = activo ? "Proveedor activado" : "Proveedor desactivado";
        return ResponseEntity.ok(ApiResponse.ok(msg, null));
    }
}
