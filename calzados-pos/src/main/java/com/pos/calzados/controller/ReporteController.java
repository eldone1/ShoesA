package com.pos.calzados.controller;

import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.CajaResponse;
import com.pos.calzados.dto.response.ReporteVentaProductoResponse;
import com.pos.calzados.dto.response.VentaResponse;
import com.pos.calzados.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReporteController {

    private final ReporteService reporteService;

    /**
     * GET /api/reportes/ventas-por-producto?inicio=2025-01-01&fin=2025-01-31
     * Ranking de productos vendidos en el rango, con cantidad y monto total.
     */
    @GetMapping("/ventas-por-producto")
    public ResponseEntity<ApiResponse<List<ReporteVentaProductoResponse>>> ventasPorProducto(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.ventasPorProducto(inicio, fin)));
    }

    /**
     * GET /api/reportes/resumen-diario?fecha=2025-01-15
     * Totales del día por método de pago + cantidad de ventas.
     */
    @GetMapping("/resumen-diario")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resumenDiario(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.resumenDiario(fecha)));
    }

    /**
     * GET /api/reportes/ventas-del-dia?fecha=2025-01-15
     * Lista completa de ventas de un día.
     */
    @GetMapping("/ventas-del-dia")
    public ResponseEntity<ApiResponse<List<VentaResponse>>> ventasDelDia(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.ventasDelDia(fecha)));
    }

    /**
     * GET /api/reportes/cajas?inicio=2025-01-01&fin=2025-01-31
     * Historial de cajas (apertura, cierre, diferencias) en el rango.
     */
    @GetMapping("/cajas")
    public ResponseEntity<ApiResponse<List<CajaResponse>>> cajas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.cajasPorRango(inicio, fin)));
    }

    /**
     * GET /api/reportes/stock-bajo
     * Variantes cuyo stock actual ≤ stock mínimo.
     */
    @GetMapping("/stock-bajo")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> stockBajo() {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.stockBajo()));
    }

    /**
     * GET /api/reportes/ingresos-inventario?desde=2025-01-01&hasta=2025-01-31
     * Variantes con fecha de ingreso en el rango para control de antiguedad.
     */
    @GetMapping("/ingresos-inventario")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> ingresosInventario(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.ingresosInventario(desde, hasta)));
    }
}
