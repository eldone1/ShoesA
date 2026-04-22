package com.pos.calzados.dto.response;

import com.pos.calzados.entity.TipoGasto;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class GastoResponse {
    private Long id;
    private TipoGasto tipo;
    private String concepto;
    private BigDecimal monto;
    private LocalDate fechaGasto;
    private String descripcion;
    private Long usuarioId;
    private String usuarioNombre;
    private LocalDateTime createdAt;
}
