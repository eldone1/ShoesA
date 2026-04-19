package com.pos.calzados.dto.request;

import com.pos.calzados.entity.TipoComprobante;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComprobanteRequest {

    @NotNull(message = "El ID de la venta es requerido")
    private Long ventaId;

    @NotNull(message = "El tipo de comprobante es requerido")
    private TipoComprobante tipo;

    // Opcional — si se envía se usan los datos del cliente registrado
    private Long clienteId;

    // Datos manuales — usados cuando no hay clienteId (boleta rápida)
    // o cuando se quiere sobrescribir los datos del cliente
    private String clienteNombre;
    private String clienteDni;
    private String clienteRuc;
    private String clienteRazonSocial;
    private String clienteDireccion;
    private String clienteEmail;
}
