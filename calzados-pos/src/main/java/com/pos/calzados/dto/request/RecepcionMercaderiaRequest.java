package com.pos.calzados.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class RecepcionMercaderiaRequest {

    @Valid
    @NotEmpty(message = "Debes enviar al menos un detalle a recepcionar")
    private List<RecepcionDetalleRequest> detalles;
}
