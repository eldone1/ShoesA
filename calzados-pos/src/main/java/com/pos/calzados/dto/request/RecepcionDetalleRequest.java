package com.pos.calzados.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecepcionDetalleRequest {

    @NotNull(message = "El detalle es requerido")
    private Long detalleId;

    @NotNull(message = "La cantidad recibida es requerida")
    @Min(value = 1, message = "La cantidad recibida debe ser mayor a 0")
    private Integer cantidadRecibida;
}
