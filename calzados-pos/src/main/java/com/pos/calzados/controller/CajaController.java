package com.pos.calzados.controller;

import com.pos.calzados.dto.request.AperturaCajaRequest;
import com.pos.calzados.dto.request.CierreCajaRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.CajaResponse;
import com.pos.calzados.entity.User;
import com.pos.calzados.service.CajaService;
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
@RequestMapping("/api/cajas")
@RequiredArgsConstructor
public class CajaController {

    private final CajaService cajaService;

    /**
     * POST /api/cajas/abrir
     * El cajero apertura su caja indicando el monto inicial.
     */
    @PostMapping("/abrir")
    public ResponseEntity<ApiResponse<CajaResponse>> abrir(
            @Valid @RequestBody AperturaCajaRequest request,
            @AuthenticationPrincipal User cajero) {
        CajaResponse response = cajaService.abrir(request, cajero.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Caja aperturada exitosamente", response));
    }

    /**
     * POST /api/cajas/{id}/cerrar
     * El cajero cierra su caja ingresando el monto físico final.
     */
    @PostMapping("/{id}/cerrar")
    public ResponseEntity<ApiResponse<CajaResponse>> cerrar(
            @PathVariable Long id,
            @Valid @RequestBody CierreCajaRequest request,
            @AuthenticationPrincipal User cajero) {
        CajaResponse response = cajaService.cerrar(id, request, cajero.getId());
        return ResponseEntity.ok(ApiResponse.ok("Caja cerrada exitosamente", response));
    }

    /**
     * GET /api/cajas/mi-caja
     * El cajero consulta su caja abierta actual.
     */
    @GetMapping("/mi-caja")
    public ResponseEntity<ApiResponse<CajaResponse>> miCajaAbierta(
            @AuthenticationPrincipal User cajero) {
        CajaResponse response = cajaService.obtenerCajaAbiertaPorCajero(cajero.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /** GET /api/cajas/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CajaResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(cajaService.obtenerPorId(id)));
    }

    /** GET /api/cajas  — solo ADMIN */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CajaResponse>>> listar() {
        return ResponseEntity.ok(ApiResponse.ok(cajaService.listar()));
    }

    /**
     * GET /api/cajas/rango?inicio=2025-01-01&fin=2025-01-31
     * Solo ADMIN — listado por rango de fecha.
     */
    @GetMapping("/rango")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CajaResponse>>> listarPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(cajaService.listarPorFecha(inicio, fin)));
    }
}
