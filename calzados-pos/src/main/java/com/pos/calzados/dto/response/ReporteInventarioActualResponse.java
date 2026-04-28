package com.pos.calzados.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteInventarioActualResponse {
    private Long varianteId;
    private String productoNombre;
    private String marcaNombre;
    private String talla;
    private String color;
    private String sku;
    private Integer stockActual;
    private Integer stockMinimo;
    private BigDecimal precioCompra;
    private BigDecimal precioVenta;
}