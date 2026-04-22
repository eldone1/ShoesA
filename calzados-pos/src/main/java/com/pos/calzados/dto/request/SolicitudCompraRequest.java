package com.pos.calzados.dto.request;

import com.pos.calzados.entity.CondicionPagoCompra;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SolicitudCompraRequest {

    @NotNull(message = "El proveedor es requerido")
    private Long proveedorId;

    @NotNull(message = "La condición de pago es requerida")
    private CondicionPagoCompra condicionPago;

    private LocalDate fechaVencimiento;

    private String observacion;

    @Valid
    @NotEmpty(message = "La solicitud debe tener al menos un detalle")
    private List<DetalleSolicitudCompraRequest> detalles;
}
