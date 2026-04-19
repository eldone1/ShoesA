package com.pos.calzados.controller;

import com.pos.calzados.dto.request.ProductoRequest;
import com.pos.calzados.dto.request.VarianteRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.ProductoResponse;
import com.pos.calzados.dto.response.VarianteResponse;
import com.pos.calzados.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    // ─── Productos ───────────────────────────────────────────────────────────────

    /** GET /api/productos?nombre=&marcaId= */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductoResponse>>> listar(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long marcaId) {
        List<ProductoResponse> lista = (nombre != null || marcaId != null)
                ? productoService.buscar(nombre, marcaId)
                : productoService.listar();
        return ResponseEntity.ok(ApiResponse.ok(lista));
    }

    /** GET /api/productos/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productoService.obtenerPorId(id)));
    }

    /** POST /api/productos */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductoResponse>> crear(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse response = productoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Producto creado exitosamente", response));
    }

    /** PUT /api/productos/{id} */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductoResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Producto actualizado", productoService.actualizar(id, request)));
    }

    /** DELETE /api/productos/{id} (baja lógica) */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Producto eliminado", null));
    }

    // ─── Variantes ───────────────────────────────────────────────────────────────

    /** POST /api/productos/{productoId}/variantes */
    @PostMapping("/{productoId}/variantes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VarianteResponse>> agregarVariante(
            @PathVariable Long productoId,
            @Valid @RequestBody VarianteRequest request) {
        VarianteResponse response = productoService.agregarVariante(productoId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Variante agregada exitosamente", response));
    }

    /** PUT /api/productos/{productoId}/variantes/{varianteId} */
    @PutMapping("/{productoId}/variantes/{varianteId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VarianteResponse>> actualizarVariante(
            @PathVariable Long productoId,
            @PathVariable Long varianteId,
            @Valid @RequestBody VarianteRequest request) {
        VarianteResponse response = productoService.actualizarVariante(productoId, varianteId, request);
        return ResponseEntity.ok(ApiResponse.ok("Variante actualizada", response));
    }

    /** DELETE /api/productos/{productoId}/variantes/{varianteId} */
    @DeleteMapping("/{productoId}/variantes/{varianteId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> eliminarVariante(
            @PathVariable Long productoId,
            @PathVariable Long varianteId) {
        productoService.eliminarVariante(productoId, varianteId);
        return ResponseEntity.ok(ApiResponse.ok("Variante eliminada", null));
    }

    /** GET /api/productos/scan/{codigoBarras}  — CAJERO escanea producto */
    @GetMapping("/scan/{codigoBarras}")
    public ResponseEntity<ApiResponse<VarianteResponse>> scanearProducto(
            @PathVariable String codigoBarras) {
        VarianteResponse response = productoService.buscarPorCodigoBarras(codigoBarras);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /** GET /api/productos/stock-bajo */
    @GetMapping("/stock-bajo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VarianteResponse>>> stockBajo() {
        return ResponseEntity.ok(ApiResponse.ok(productoService.variantesConStockBajo()));
    }
}
