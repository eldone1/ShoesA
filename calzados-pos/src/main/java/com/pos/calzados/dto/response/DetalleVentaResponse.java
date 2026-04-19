package com.pos.calzados.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DetalleVentaResponse {
    private Long id;
    private Long varianteId;
    private String productoNombre;
    private String marcaNombre;
    private String talla;
    private String color;
    private String sku;
    private String codigoBarras;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal descuentoItem;
    private BigDecimal subtotal;
}
