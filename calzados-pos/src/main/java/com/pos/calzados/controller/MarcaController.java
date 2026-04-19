package com.pos.calzados.controller;

import com.pos.calzados.dto.request.MarcaRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.MarcaResponse;
import com.pos.calzados.service.MarcaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
@RequiredArgsConstructor
public class MarcaController {

    private final MarcaService marcaService;

    /** GET /api/marcas  — ADMIN y CAJERO pueden listar */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MarcaResponse>>> listar() {
        return ResponseEntity.ok(ApiResponse.ok(marcaService.listarActivas()));
    }

    /** GET /api/marcas/todas  — solo ADMIN */
    @GetMapping("/todas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<MarcaResponse>>> listarTodas() {
        return ResponseEntity.ok(ApiResponse.ok(marcaService.listar()));
    }

    /** GET /api/marcas/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MarcaResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(marcaService.obtenerPorId(id)));
    }

    /** POST /api/marcas */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarcaResponse>> crear(@Valid @RequestBody MarcaRequest request) {
        MarcaResponse response = marcaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Marca creada exitosamente", response));
    }

    /** PUT /api/marcas/{id} */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarcaResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody MarcaRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Marca actualizada", marcaService.actualizar(id, request)));
    }

    /** DELETE /api/marcas/{id}  (baja lógica) */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        marcaService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Marca eliminada", null));
    }
}
