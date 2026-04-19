package com.pos.calzados.controller;

import com.pos.calzados.dto.request.ComprobanteRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.ComprobanteResponse;
import com.pos.calzados.entity.TipoComprobante;
import com.pos.calzados.service.ComprobanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/comprobantes")
@RequiredArgsConstructor
public class ComprobanteController {

    private final ComprobanteService comprobanteService;

    /**
     * POST /api/comprobantes
     * Emite un comprobante (boleta o factura) para una venta existente.
     * Puede venir con clienteId (cliente registrado) o con datos manuales.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ComprobanteResponse>> emitir(
            @Valid @RequestBody ComprobanteRequest request) {
        ComprobanteResponse response = comprobanteService.emitir(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Comprobante emitido: " + response.getSerie(), response));
    }

    /** GET /api/comprobantes/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComprobanteResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(comprobanteService.obtenerPorId(id)));
    }

    /** GET /api/comprobantes/serie/{serie}  — ej: BO-00001 */
    @GetMapping("/serie/{serie}")
    public ResponseEntity<ApiResponse<ComprobanteResponse>> obtenerPorSerie(@PathVariable String serie) {
        return ResponseEntity.ok(ApiResponse.ok(comprobanteService.obtenerPorSerie(serie)));
    }

    /** GET /api/comprobantes/venta/{ventaId}  — comprobante de una venta */
    @GetMapping("/venta/{ventaId}")
    public ResponseEntity<ApiResponse<ComprobanteResponse>> obtenerPorVenta(@PathVariable Long ventaId) {
        return ResponseEntity.ok(ApiResponse.ok(comprobanteService.obtenerPorVentaId(ventaId)));
    }

    /**
     * GET /api/comprobantes?inicio=2025-01-01&fin=2025-01-31&tipo=BOLETA
     * tipo es opcional — si no se envía devuelve boletas y facturas
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ComprobanteResponse>>> listar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            @RequestParam(required = false) TipoComprobante tipo) {
        return ResponseEntity.ok(ApiResponse.ok(
                comprobanteService.listarPorFecha(inicio, fin, tipo)));
    }

    /** GET /api/comprobantes/cliente/{clienteId}  — historial de un cliente */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ApiResponse<List<ComprobanteResponse>>> porCliente(
            @PathVariable Long clienteId) {
        return ResponseEntity.ok(ApiResponse.ok(
                comprobanteService.listarPorCliente(clienteId)));
    }
}
