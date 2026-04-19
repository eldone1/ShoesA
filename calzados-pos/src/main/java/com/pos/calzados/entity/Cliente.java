package com.pos.calzados.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(unique = true, length = 8)
    private String dni;

    @Column(unique = true, length = 11)
    private String ruc;

    @Column(name = "razon_social", length = 200)
    private String razonSocial;          // Nombre empresa si tiene RUC

    @Column(name = "numero_telefono", length = 15)
    private String numeroTelefono;

    @Column(length = 150)
    private String email;

    @Column(length = 250)
    private String direccion;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Comprobante> comprobantes = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
