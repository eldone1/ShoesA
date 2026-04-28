package com.pos.calzados.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteVentasPorCajeroDiaResponse {
    private LocalDate fecha;
    private Long cajeroId;
    private String cajeroNombre;
    private Long cantidadVentas;
    private BigDecimal totalVendido;
}