package com.pos.calzados.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ClienteRequest {

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 150)
    private String nombre;

    @Size(min = 8, max = 8, message = "El DNI debe tener exactamente 8 dígitos")
    @Pattern(regexp = "\\d{8}", message = "El DNI solo debe contener dígitos")
    private String dni;

    @Size(min = 11, max = 11, message = "El RUC debe tener exactamente 11 dígitos")
    @Pattern(regexp = "\\d{11}", message = "El RUC solo debe contener dígitos")
    private String ruc;

    @Size(max = 200)
    private String razonSocial;

    @Size(max = 15)
    private String numeroTelefono;

    @Email(message = "Email inválido")
    @Size(max = 150)
    private String email;

    @Size(max = 250)
    private String direccion;
}
