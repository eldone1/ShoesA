package com.pos.calzados.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cajas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Caja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cajero_id", nullable = false)
    private User cajero;

    @Column(nullable = false, updatable = false)
    private LocalDateTime apertura;

    private LocalDateTime cierre;

    @Column(name = "monto_inicial", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoInicial;

    @Column(name = "total_efectivo", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalEfectivo = BigDecimal.ZERO;

    @Column(name = "total_yape", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalYape = BigDecimal.ZERO;

    @Column(name = "total_tarjeta", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalTarjeta = BigDecimal.ZERO;

    @Column(name = "monto_final_esperado", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal montoFinalEsperado = BigDecimal.ZERO;

    @Column(name = "monto_final_real", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal montoFinalReal = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal diferencia = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private EstadoCaja estado = EstadoCaja.ABIERTA;

    @PrePersist
    public void prePersist() {
        this.apertura = LocalDateTime.now();
    }
}
