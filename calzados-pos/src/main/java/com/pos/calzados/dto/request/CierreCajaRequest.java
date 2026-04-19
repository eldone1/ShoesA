package com.pos.calzados.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CierreCajaRequest {

    @DecimalMin(value = "0.00", message = "El monto final no puede ser negativo")
    private BigDecimal montoFinalReal;
}
