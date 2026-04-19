package com.pos.calzados.dto.response;

import lombok.Data;

@Data
public class MarcaResponse {
    private Long id;
    private String nombre;
    private Boolean activo;
}
