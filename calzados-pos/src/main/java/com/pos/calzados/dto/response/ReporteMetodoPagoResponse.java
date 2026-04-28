package com.pos.calzados.dto.response;

import com.pos.calzados.entity.MetodoPago;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteMetodoPagoResponse {
    private MetodoPago metodoPago;
    private Long cantidadVentas;
    private BigDecimal totalVendido;
}