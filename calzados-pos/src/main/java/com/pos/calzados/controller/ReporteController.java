package com.pos.calzados.controller;

import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.CajaResponse;
import com.pos.calzados.dto.response.ReporteInventarioActualResponse;
import com.pos.calzados.dto.response.ReporteMetodoPagoResponse;
import com.pos.calzados.dto.response.ReporteProductoSinRotacionResponse;
import com.pos.calzados.dto.response.ReporteUtilidadResponse;
import com.pos.calzados.dto.response.ReporteVentasPorCajeroDiaResponse;
import com.pos.calzados.dto.response.ReporteVentasPorCajeroResponse;
import com.pos.calzados.dto.response.ReporteVentaProductoResponse;
import com.pos.calzados.dto.response.ReporteVentasPorDiaResponse;
import com.pos.calzados.dto.response.ReporteVentasPorMesResponse;
import com.pos.calzados.dto.response.ReporteVentasPorTallaResponse;
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

    /** GET /api/reportes/ventas-por-dia?inicio=2025-01-01&fin=2025-01-31 */
    @GetMapping("/ventas-por-dia")
    public ResponseEntity<ApiResponse<List<ReporteVentasPorDiaResponse>>> ventasPorDia(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.ventasPorDia(inicio, fin)));
    }

    /** GET /api/reportes/ventas-por-mes?inicio=2025-01-01&fin=2025-12-31 */
    @GetMapping("/ventas-por-mes")
    public ResponseEntity<ApiResponse<List<ReporteVentasPorMesResponse>>> ventasPorMes(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.ventasPorMes(inicio, fin)));
    }

    /** GET /api/reportes/utilidad?inicio=2025-01-01&fin=2025-01-31 */
    @GetMapping("/utilidad")
    public ResponseEntity<ApiResponse<ReporteUtilidadResponse>> utilidad(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.utilidad(inicio, fin)));
    }

    /** GET /api/reportes/ventas-por-talla?inicio=2025-01-01&fin=2025-01-31 */
    @GetMapping("/ventas-por-talla")
    public ResponseEntity<ApiResponse<List<ReporteVentasPorTallaResponse>>> ventasPorTalla(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.ventasPorTalla(inicio, fin)));
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

    /** GET /api/reportes/inventario-actual */
    @GetMapping("/inventario-actual")
    public ResponseEntity<ApiResponse<List<ReporteInventarioActualResponse>>> inventarioActual() {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.inventarioActual()));
    }

    /** GET /api/reportes/productos-agotados */
    @GetMapping("/productos-agotados")
    public ResponseEntity<ApiResponse<List<ReporteInventarioActualResponse>>> productosAgotados() {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.productosAgotados()));
    }

    /** GET /api/reportes/productos-sin-rotacion?inicio=2025-01-01&fin=2025-01-31 */
    @GetMapping("/productos-sin-rotacion")
    public ResponseEntity<ApiResponse<List<ReporteProductoSinRotacionResponse>>> productosSinRotacion(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.productosSinRotacion(inicio, fin)));
    }

    /** GET /api/reportes/ventas-por-cajero?inicio=2025-01-01&fin=2025-01-31 */
    @GetMapping("/ventas-por-cajero")
    public ResponseEntity<ApiResponse<List<ReporteVentasPorCajeroResponse>>> ventasPorCajero(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.ventasPorCajero(inicio, fin)));
    }

    /** GET /api/reportes/ventas-por-cajero-dia?inicio=2025-01-01&fin=2025-01-31 */
    @GetMapping("/ventas-por-cajero-dia")
    public ResponseEntity<ApiResponse<List<ReporteVentasPorCajeroDiaResponse>>> ventasPorCajeroDia(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.ventasPorCajeroDia(inicio, fin)));
    }

    /** GET /api/reportes/metodos-pago?inicio=2025-01-01&fin=2025-01-31 */
    @GetMapping("/metodos-pago")
    public ResponseEntity<ApiResponse<List<ReporteMetodoPagoResponse>>> metodosPago(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(ApiResponse.ok(reporteService.metodosPago(inicio, fin)));
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
