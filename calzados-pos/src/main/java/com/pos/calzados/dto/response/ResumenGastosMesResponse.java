package com.pos.calzados.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ResumenGastosMesResponse {
    private int year;
    private int month;
    private BigDecimal totalVentasMes;
    private BigDecimal totalGastosMes;
    private BigDecimal saldoMes;
}
