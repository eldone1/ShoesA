package com.pos.calzados.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteProductoSinRotacionResponse {
    private Long varianteId;
    private String productoNombre;
    private String marcaNombre;
    private String talla;
    private String color;
    private String sku;
    private Integer stockActual;
    private LocalDateTime ultimaVenta;
    private Long diasSinVenta;
    private BigDecimal precioCompra;
}