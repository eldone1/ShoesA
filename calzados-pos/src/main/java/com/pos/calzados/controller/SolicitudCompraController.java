package com.pos.calzados.controller;

import com.pos.calzados.dto.request.RecepcionMercaderiaRequest;
import com.pos.calzados.dto.request.SolicitudCompraRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.SolicitudCompraResponse;
import com.pos.calzados.entity.EstadoSolicitudCompra;
import com.pos.calzados.entity.User;
import com.pos.calzados.service.SolicitudCompraService;
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
@RequestMapping("/api/proveedores/solicitudes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SolicitudCompraController {

    private final SolicitudCompraService solicitudCompraService;

    @PostMapping
    public ResponseEntity<ApiResponse<SolicitudCompraResponse>> crear(
            @Valid @RequestBody SolicitudCompraRequest request,
            @AuthenticationPrincipal User user) {
        SolicitudCompraResponse response = solicitudCompraService.crear(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Solicitud de compra registrada", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SolicitudCompraResponse>>> listar(
            @RequestParam(required = false) Long proveedorId,
            @RequestParam(required = false) EstadoSolicitudCompra estado,
            @RequestParam(required = false) Boolean pagado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(ApiResponse.ok(solicitudCompraService.listar(proveedorId, estado, pagado, desde, hasta)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SolicitudCompraResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(solicitudCompraService.obtenerPorId(id)));
    }

    @PostMapping("/{id}/recepcionar")
    public ResponseEntity<ApiResponse<SolicitudCompraResponse>> recepcionar(
            @PathVariable Long id,
            @Valid @RequestBody RecepcionMercaderiaRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Mercadería recepcionada", solicitudCompraService.recepcionar(id, request)));
    }

    @PatchMapping("/{id}/pagado")
    public ResponseEntity<ApiResponse<SolicitudCompraResponse>> marcarPagado(
            @PathVariable Long id,
            @RequestParam boolean pagado) {
        String msg = pagado ? "Solicitud marcada como pagada" : "Solicitud marcada como no pagada";
        return ResponseEntity.ok(ApiResponse.ok(msg, solicitudCompraService.marcarPagado(id, pagado)));
    }
}
