package com.pos.calzados.dto.response;

import com.pos.calzados.entity.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tipo = "Bearer";
    private Long userId;
    private String nombre;
    private String email;
    private Rol rol;
}
