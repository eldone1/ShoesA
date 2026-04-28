package com.pos.calzados.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteVentasPorCajeroResponse {
    private Long cajeroId;
    private String cajeroNombre;
    private Long cantidadVentas;
    private BigDecimal totalVendido;
    private BigDecimal totalEfectivo;
    private BigDecimal totalYape;
    private BigDecimal totalTarjeta;
}