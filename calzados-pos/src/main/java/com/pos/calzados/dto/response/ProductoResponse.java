package com.pos.calzados.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private Boolean activo;
    private MarcaResponse marca;
    private List<VarianteResponse> variantes;
}
