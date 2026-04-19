package com.pos.calzados.repository;

import com.pos.calzados.entity.Comprobante;
import com.pos.calzados.entity.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComprobanteRepository extends JpaRepository<Comprobante, Long> {

    Optional<Comprobante> findBySerie(String serie);
    Optional<Comprobante> findByVentaId(Long ventaId);
    boolean existsByVentaId(Long ventaId);

    // Último número correlativo por tipo (para generar el siguiente)
    @Query("SELECT COALESCE(MAX(c.numero), 0) FROM Comprobante c WHERE c.tipo = :tipo")
    Integer findMaxNumeroByTipo(@Param("tipo") TipoComprobante tipo);

    // Búsqueda por rango de fecha
    @Query("""
        SELECT c FROM Comprobante c
        LEFT JOIN FETCH c.cliente
        JOIN FETCH c.venta v
        JOIN FETCH v.cajero
        WHERE c.fechaEmision BETWEEN :inicio AND :fin
        ORDER BY c.fechaEmision DESC
        """)
    List<Comprobante> findByRangoFecha(
        @Param("inicio") LocalDateTime inicio,
        @Param("fin")    LocalDateTime fin
    );

    // Por tipo + rango de fecha
    @Query("""
        SELECT c FROM Comprobante c
        LEFT JOIN FETCH c.cliente
        JOIN FETCH c.venta v
        JOIN FETCH v.cajero
        WHERE c.tipo = :tipo
          AND c.fechaEmision BETWEEN :inicio AND :fin
        ORDER BY c.fechaEmision DESC
        """)
    List<Comprobante> findByTipoAndRangoFecha(
        @Param("tipo")   TipoComprobante tipo,
        @Param("inicio") LocalDateTime inicio,
        @Param("fin")    LocalDateTime fin
    );

    // Por cliente
    @Query("""
        SELECT c FROM Comprobante c
        LEFT JOIN FETCH c.cliente
        JOIN FETCH c.venta
        WHERE c.cliente.id = :clienteId
        ORDER BY c.fechaEmision DESC
        """)
    List<Comprobante> findByClienteId(@Param("clienteId") Long clienteId);

    // Con detalles de venta para vista completa
    @Query("""
        SELECT c FROM Comprobante c
        LEFT JOIN FETCH c.cliente
        JOIN FETCH c.venta v
        JOIN FETCH v.cajero
        JOIN FETCH v.detalles d
        JOIN FETCH d.variante va
        JOIN FETCH va.producto p
        LEFT JOIN FETCH p.marca
        WHERE c.id = :id
        """)
    Optional<Comprobante> findByIdWithDetalles(@Param("id") Long id);
}
