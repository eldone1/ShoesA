package com.pos.calzados.dto.response;

import com.pos.calzados.entity.TipoComprobante;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ComprobanteResponse {
    private Long id;
    private String serie;
    private TipoComprobante tipo;
    private Integer numero;
    private LocalDateTime fechaEmision;

    // Datos del cliente (snapshot)
    private Long clienteId;
    private String clienteNombre;
    private String clienteDni;
    private String clienteRuc;
    private String clienteRazonSocial;
    private String clienteDireccion;
    private String clienteEmail;

    // Datos de la venta
    private Long ventaId;
    private String cajeroNombre;
    private BigDecimal subtotal;
    private BigDecimal descuento;
    private BigDecimal total;
    private BigDecimal igv;
    private BigDecimal baseImponible;
    private String metodoPago;

    // Detalle de ítems (solo en vista completa)
    private List<DetalleVentaResponse> detalles;
}
