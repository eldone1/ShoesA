package com.pos.calzados.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ProductoRequest {

    private Long marcaId;

    @NotBlank(message = "El nombre del producto es requerido")
    @Size(max = 150)
    private String nombre;

    private String descripcion;

    @Valid
    private List<VarianteRequest> variantes;
}
