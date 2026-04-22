package com.pos.calzados.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProveedorRequest {

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 150)
    private String nombre;

    @NotBlank(message = "El RUC es requerido")
    @Pattern(regexp = "^\\d{11}$", message = "El RUC debe tener 11 dígitos")
    private String ruc;

    @NotBlank(message = "El contacto es requerido")
    @Size(max = 100)
    private String contacto;

    @NotBlank(message = "El teléfono es requerido")
    @Size(max = 15)
    private String numeroTelefono;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email no es válido")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "La dirección es requerida")
    @Size(max = 250)
    private String direccion;

    @Min(value = 0, message = "Los días de crédito no pueden ser negativos")
    @Max(value = 365, message = "Los días de crédito no deben exceder 365")
    private Integer diasCredito;
}
