package com.pos.calzados.controller;

import com.pos.calzados.dto.request.GastoRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.GastoResponse;
import com.pos.calzados.dto.response.ResumenGastosMesResponse;
import com.pos.calzados.entity.User;
import com.pos.calzados.service.GastoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class GastoController {

    private final GastoService gastoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GastoResponse>>> listarMes(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        LocalDate now = LocalDate.now();
        int y = year != null ? year : now.getYear();
        int m = month != null ? month : now.getMonthValue();
        return ResponseEntity.ok(ApiResponse.ok(gastoService.listarMes(y, m)));
    }

    @GetMapping("/resumen-mes")
    public ResponseEntity<ApiResponse<ResumenGastosMesResponse>> resumenMes(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        LocalDate now = LocalDate.now();
        int y = year != null ? year : now.getYear();
        int m = month != null ? month : now.getMonthValue();
        return ResponseEntity.ok(ApiResponse.ok(gastoService.resumenMes(y, m)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GastoResponse>> crear(
            @Valid @RequestBody GastoRequest request,
            @AuthenticationPrincipal User user) {
        GastoResponse created = gastoService.crear(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Gasto registrado exitosamente", created));
    }
}
