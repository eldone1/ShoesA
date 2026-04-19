package com.pos.calzados.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VarianteResponse {
    private Long id;
    private String productoNombre;
    private String color;
    private String talla;
    private String ubicacion;
    private String sku;
    private String codigoBarras;
    private BigDecimal precioCompra;
    private BigDecimal porcentajeGanancia;
    private BigDecimal precioVenta;
    private Integer stock;
    private Integer stockMinimo;
    private Boolean stockBajo;
}
