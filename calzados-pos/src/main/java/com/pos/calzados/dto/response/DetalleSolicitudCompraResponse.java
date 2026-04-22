package com.pos.calzados.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DetalleSolicitudCompraResponse {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private Long varianteId;
    private String varianteSku;
    private String varianteColor;
    private String varianteTalla;
    private Integer cantidadSolicitada;
    private Integer cantidadRecibida;
    private Integer cantidadPendiente;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
