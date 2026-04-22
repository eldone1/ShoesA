package com.pos.calzados.repository;

import com.pos.calzados.entity.EstadoSolicitudCompra;
import com.pos.calzados.entity.SolicitudCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudCompraRepository extends JpaRepository<SolicitudCompra, Long> {

    @Query("SELECT s FROM SolicitudCompra s " +
           "JOIN FETCH s.proveedor p " +
           "JOIN FETCH s.usuario u " +
           "LEFT JOIN FETCH s.detalles d " +
           "LEFT JOIN FETCH d.producto " +
           "LEFT JOIN FETCH d.variante " +
           "WHERE s.id = :id")
    Optional<SolicitudCompra> findByIdWithDetalles(@Param("id") Long id);

    @Query("SELECT DISTINCT s FROM SolicitudCompra s " +
           "JOIN FETCH s.proveedor p " +
           "JOIN FETCH s.usuario u " +
           "WHERE (:proveedorId IS NULL OR p.id = :proveedorId) " +
           "AND (:estado IS NULL OR s.estado = :estado) " +
           "AND (:pagado IS NULL OR s.pagado = :pagado) " +
           "AND (:desde IS NULL OR s.fechaSolicitud >= :desde) " +
           "AND (:hasta IS NULL OR s.fechaSolicitud <= :hasta) " +
           "ORDER BY s.fechaSolicitud DESC")
    List<SolicitudCompra> filtrar(@Param("proveedorId") Long proveedorId,
                                  @Param("estado") EstadoSolicitudCompra estado,
                                  @Param("pagado") Boolean pagado,
                                  @Param("desde") LocalDateTime desde,
                                  @Param("hasta") LocalDateTime hasta);
}
