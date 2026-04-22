package com.pos.calzados.dto.response;

import com.pos.calzados.entity.CondicionPagoCompra;
import com.pos.calzados.entity.EstadoSolicitudCompra;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SolicitudCompraResponse {
    private Long id;
    private String codigo;
    private ProveedorResponse proveedor;
    private Long usuarioId;
    private String usuarioNombre;
    private CondicionPagoCompra condicionPago;
    private LocalDate fechaVencimiento;
    private LocalDateTime fechaSolicitud;
    private BigDecimal total;
    private Boolean pagado;
    private EstadoSolicitudCompra estado;
    private String observacion;
    private List<DetalleSolicitudCompraResponse> detalles;
}
