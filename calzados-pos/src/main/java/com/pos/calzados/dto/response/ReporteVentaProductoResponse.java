package com.pos.calzados.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteVentaProductoResponse {
    private Long varianteId;
    private String productoNombre;
    private String talla;
    private String color;
    private Long cantidadVendida;
    private BigDecimal totalVendido;
}
