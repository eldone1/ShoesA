package com.pos.calzados.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DetalleVentaRequest {

    @NotNull(message = "La variante es requerida")
    private Long varianteId;

    @NotNull(message = "La cantidad es requerida")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    @DecimalMin(value = "0.00")
    private BigDecimal descuentoItem = BigDecimal.ZERO;
}
