package com.pos.calzados.dto.response;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilidadBaseDTO {
    private BigDecimal totalVendido;
    private BigDecimal totalCosto;

}
