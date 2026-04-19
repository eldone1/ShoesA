package com.pos.calzados.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VarianteRequest {

    @Size(max = 50)
    private String color;

    @Size(max = 20)
    private String talla;

    @Size(max = 20)
    private String ubicacion;

    @Size(max = 50)
    private String sku;

    @Size(max = 100)
    private String codigoBarras;

    @NotNull(message = "El precio de compra es requerido")
    @DecimalMin(value = "0.01", message = "El precio de compra debe ser mayor a 0")
    private BigDecimal precioCompra;

    @NotNull(message = "El porcentaje de ganancia es requerido")
    @DecimalMin(value = "0.00", message = "El porcentaje no puede ser negativo")
    @DecimalMax(value = "999.99")
    private BigDecimal porcentajeGanancia;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock = 0;

    @Min(value = 0)
    private Integer stockMinimo = 5;
}
