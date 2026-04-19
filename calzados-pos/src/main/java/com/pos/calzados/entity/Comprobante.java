package com.pos.calzados.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "comprobantes")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class Comprobante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Correlativo generado: BO-00001 | FA-00001
    @Column(unique = true, nullable = false, length = 20)
    private String serie;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 10)
    private TipoComprobante tipo;

    // Número correlativo numérico (para generar la serie)
    @Column(nullable = false)
    private Integer numero;

    // Venta asociada (1:1)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false, unique = true)
    private Venta venta;

    // Cliente (opcional — boleta sin datos o venta rápida)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Datos del cliente snapshoteados al momento de emitir
    // (si el cliente cambia sus datos después, el comprobante queda intacto)
    @Column(name = "cliente_nombre", length = 200)
    private String clienteNombre;

    @Column(name = "cliente_dni", length = 8)
    private String clienteDni;

    @Column(name = "cliente_ruc", length = 11)
    private String clienteRuc;

    @Column(name = "cliente_razon_social", length = 200)
    private String clienteRazonSocial;

    @Column(name = "cliente_direccion", length = 250)
    private String clienteDireccion;

    @Column(name = "cliente_email", length = 150)
    private String clienteEmail;

    // Totales snapshoteados de la venta
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal descuento = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    // IGV (18%) — informativo
    @Column(name = "igv", precision = 12, scale = 2)
    private BigDecimal igv;

    @Column(name = "base_imponible", precision = 12, scale = 2)
    private BigDecimal baseImponible;

    @Column(name = "fecha_emision", nullable = false, updatable = false)
    private LocalDateTime fechaEmision;

    @PrePersist
    public void prePersist() {
        this.fechaEmision = LocalDateTime.now();
    }
}
