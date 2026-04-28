package com.pos.calzados.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteVentasPorMesResponse {
    private Integer year;
    private Integer month;
    private Long cantidadVentas;
    private BigDecimal totalVendido;
}
