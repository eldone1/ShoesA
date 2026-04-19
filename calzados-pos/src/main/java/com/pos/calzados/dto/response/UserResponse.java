package com.pos.calzados.dto.response;

import com.pos.calzados.entity.Rol;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
    private Boolean activo;
    private LocalDateTime createdAt;
}
