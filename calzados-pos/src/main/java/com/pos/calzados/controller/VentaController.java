package com.pos.calzados.controller;

import com.pos.calzados.dto.request.VentaRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.VentaResponse;
import com.pos.calzados.entity.User;
import com.pos.calzados.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    /**
     * POST /api/ventas
     * El cajero registra la venta; el stock se descuenta automáticamente.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<VentaResponse>> registrar(
            @Valid @RequestBody VentaRequest request,
            @AuthenticationPrincipal User cajero) {
        VentaResponse response = ventaService.registrar(request, cajero.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Venta registrada exitosamente", response));
    }

    /** GET /api/ventas/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VentaResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(ventaService.obtenerPorId(id)));
    }

    /** GET /api/ventas/caja/{cajaId} */
    @GetMapping("/caja/{cajaId}")
    public ResponseEntity<ApiResponse<List<VentaResponse>>> porCaja(@PathVariable Long cajaId) {
        return ResponseEntity.ok(ApiResponse.ok(ventaService.listarPorCaja(cajaId)));
    }

    /**
     * GET /api/ventas/rango?inicio=2025-01-01&fin=2025-01-31
     * Solo ADMIN.
     */
    @GetMapping("/rango")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VentaResponse>>> porFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(ventaService.listarPorFecha(inicio, fin)));
    }

    /**
     * GET /api/ventas/mis-ventas?inicio=2025-01-01&fin=2025-01-31
     * Cada cajero consulta sus propias ventas.
     */
    @GetMapping("/mis-ventas")
    public ResponseEntity<ApiResponse<List<VentaResponse>>> misVentas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @AuthenticationPrincipal User cajero) {
        return ResponseEntity.ok(ApiResponse.ok(
                ventaService.listarPorCajeroYFecha(cajero.getId(), inicio, fin)));
    }
}
