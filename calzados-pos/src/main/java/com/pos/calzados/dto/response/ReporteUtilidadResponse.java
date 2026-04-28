package com.pos.calzados.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteUtilidadResponse {
    private LocalDate desde;
    private LocalDate hasta;
    private BigDecimal totalVendido;
    private BigDecimal totalCosto;
    private BigDecimal totalGastos;
    private BigDecimal gananciaBruta;
    private BigDecimal gananciaReal;
    private BigDecimal margenBruto;
    private BigDecimal margenReal;
}