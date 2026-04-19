package com.pos.calzados.dto.request;

import com.pos.calzados.entity.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100)
    private String nombre;

    @NotBlank(message = "El email es requerido")
    @Email(message = "Email inválido")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @NotNull(message = "El rol es requerido")
    private Rol rol;
}
