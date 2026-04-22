package com.pos.calzados.dto.request;

import com.pos.calzados.entity.TipoGasto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class GastoRequest {

    @NotNull(message = "El tipo de gasto es requerido")
    private TipoGasto tipo;

    @NotBlank(message = "El concepto es requerido")
    @Size(max = 180, message = "El concepto no puede superar 180 caracteres")
    private String concepto;

    @NotNull(message = "El monto es requerido")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    @NotNull(message = "La fecha del gasto es requerida")
    private LocalDate fechaGasto;

    @Size(max = 1000, message = "La descripción no puede superar 1000 caracteres")
    private String descripcion;
}
