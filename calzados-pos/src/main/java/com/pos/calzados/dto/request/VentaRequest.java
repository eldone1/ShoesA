package com.pos.calzados.dto.request;

import com.pos.calzados.entity.MetodoPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class VentaRequest {

    @NotNull(message = "El método de pago es requerido")
    private MetodoPago metodoPago;

    // Solo requerido si metodoPago = EFECTIVO
    private BigDecimal montoRecibido;

    @DecimalMin(value = "0.00")
    private BigDecimal descuento = BigDecimal.ZERO;

    private String notas;

    @NotEmpty(message = "Debe agregar al menos un producto")
    @Valid
    private List<DetalleVentaRequest> detalles;
}
