package com.pos.calzados.repository;

import com.pos.calzados.entity.MetodoPago;
import com.pos.calzados.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    List<Venta> findByCajaId(Long cajaId);

    @Query("SELECT v FROM Venta v JOIN FETCH v.cajero JOIN FETCH v.caja " +
           "WHERE v.fecha BETWEEN :inicio AND :fin ORDER BY v.fecha DESC")
    List<Venta> findByRangoFecha(@Param("inicio") LocalDateTime inicio,
                                  @Param("fin") LocalDateTime fin);

    @Query("SELECT v FROM Venta v JOIN FETCH v.cajero JOIN FETCH v.caja " +
           "WHERE v.cajero.id = :cajeroId AND v.fecha BETWEEN :inicio AND :fin ORDER BY v.fecha DESC")
    List<Venta> findByCajeroAndRangoFecha(@Param("cajeroId") Long cajeroId,
                                           @Param("inicio") LocalDateTime inicio,
                                           @Param("fin") LocalDateTime fin);

    @Query("SELECT v FROM Venta v JOIN FETCH v.cajero JOIN FETCH v.caja " +
           "WHERE v.fecha BETWEEN :inicio AND :fin " +
           "AND (:cajeroId IS NULL OR v.cajero.id = :cajeroId) " +
           "AND (:metodoPago IS NULL OR v.metodoPago = :metodoPago) " +
           "ORDER BY v.fecha DESC")
    List<Venta> findByFiltros(@Param("inicio") LocalDateTime inicio,
                              @Param("fin") LocalDateTime fin,
                              @Param("cajeroId") Long cajeroId,
                              @Param("metodoPago") MetodoPago metodoPago);

    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.caja.id = :cajaId AND v.metodoPago = :metodo")
    BigDecimal sumTotalByCajaAndMetodo(@Param("cajaId") Long cajaId, @Param("metodo") MetodoPago metodo);

    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.caja.id = :cajaId")
    BigDecimal sumTotalByCaja(@Param("cajaId") Long cajaId);

       @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.fecha BETWEEN :inicio AND :fin")
       BigDecimal sumTotalByRangoFecha(@Param("inicio") LocalDateTime inicio,
                                                               @Param("fin") LocalDateTime fin);

    @Query("SELECT v FROM Venta v JOIN FETCH v.detalles d JOIN FETCH d.variante va " +
           "JOIN FETCH va.producto p JOIN FETCH p.marca WHERE v.id = :id")
    Optional<Venta> findByIdWithDetalles(@Param("id") Long id);

    // Reporte: ventas por producto en rango de fechas
    @Query("SELECT dv.variante.id, dv.variante.producto.nombre, dv.variante.talla, dv.variante.color, " +
           "SUM(dv.cantidad), SUM(dv.subtotal) " +
           "FROM DetalleVenta dv WHERE dv.venta.fecha BETWEEN :inicio AND :fin " +
           "GROUP BY dv.variante.id, dv.variante.producto.nombre, dv.variante.talla, dv.variante.color " +
           "ORDER BY SUM(dv.subtotal) DESC")
    List<Object[]> reporteVentasPorProducto(@Param("inicio") LocalDateTime inicio,
                                             @Param("fin") LocalDateTime fin);
}
