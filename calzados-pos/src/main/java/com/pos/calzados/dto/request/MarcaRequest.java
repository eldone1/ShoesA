package com.pos.calzados.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MarcaRequest {

    @NotBlank(message = "El nombre de la marca es requerido")
    @Size(max = 100)
    private String nombre;
}
