package com.pos.calzados.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "marca")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Boolean activo = true;
}
