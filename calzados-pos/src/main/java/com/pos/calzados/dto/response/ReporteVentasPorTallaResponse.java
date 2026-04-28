package com.pos.calzados.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteVentasPorTallaResponse {
    private String talla;
    private Long cantidadVendida;
    private BigDecimal totalVendido;
}