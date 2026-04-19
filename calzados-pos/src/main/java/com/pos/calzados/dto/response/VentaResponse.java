package com.pos.calzados.dto.response;

import com.pos.calzados.entity.MetodoPago;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VentaResponse {
    private Long id;
    private Long cajaId;
    private UserResponse cajero;
    private LocalDateTime fecha;
    private BigDecimal subtotal;
    private BigDecimal descuento;
    private BigDecimal total;
    private MetodoPago metodoPago;
    private BigDecimal montoRecibido;
    private BigDecimal vuelto;
    private String notas;
    private List<DetalleVentaResponse> detalles;
}
