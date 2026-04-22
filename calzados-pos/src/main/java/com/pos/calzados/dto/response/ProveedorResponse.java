package com.pos.calzados.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProveedorResponse {
    private Long id;
    private String nombre;
    private String ruc;
    private String contacto;
    private String numeroTelefono;
    private String email;
    private String direccion;
    private Integer diasCredito;
    private Boolean activo;
    private LocalDateTime createdAt;
}
