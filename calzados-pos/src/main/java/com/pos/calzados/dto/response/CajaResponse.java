package com.pos.calzados.dto.response;

import com.pos.calzados.entity.EstadoCaja;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CajaResponse {
    private Long id;
    private UserResponse cajero;
    private LocalDateTime apertura;
    private LocalDateTime cierre;
    private BigDecimal montoInicial;
    private BigDecimal totalEfectivo;
    private BigDecimal totalYape;
    private BigDecimal totalTarjeta;
    private BigDecimal montoFinalEsperado;
    private BigDecimal montoFinalReal;
    private BigDecimal diferencia;
    private EstadoCaja estado;
    private BigDecimal totalVentas;
}
