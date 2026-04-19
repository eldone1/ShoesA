package com.pos.calzados.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClienteResponse {
    private Long id;
    private String nombre;
    private String dni;
    private String ruc;
    private String razonSocial;
    private String numeroTelefono;
    private String email;
    private String direccion;
    private Boolean activo;
    private LocalDateTime createdAt;
}
