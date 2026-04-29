package com.pos.calzados.repository;

import com.pos.calzados.dto.response.ReporteUtilidadResponse;
import com.pos.calzados.dto.response.UtilidadBaseDTO;
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

       @Query("SELECT DATE(v.fecha), COUNT(v), COALESCE(SUM(v.total), 0) " +
                     "FROM Venta v WHERE v.fecha BETWEEN :inicio AND :fin " +
                     "GROUP BY DATE(v.fecha) ORDER BY DATE(v.fecha)")
       List<Object[]> reporteVentasPorDia(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       @Query("SELECT YEAR(v.fecha), MONTH(v.fecha), COUNT(v), COALESCE(SUM(v.total), 0) " +
                     "FROM Venta v WHERE v.fecha BETWEEN :inicio AND :fin " +
                     "GROUP BY YEAR(v.fecha), MONTH(v.fecha) " +
                     "ORDER BY YEAR(v.fecha), MONTH(v.fecha)")
       List<Object[]> reporteVentasPorMes(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       @Query("SELECT v.cajero.id, v.cajero.nombre, COUNT(v), COALESCE(SUM(v.total), 0), " +
                     "COALESCE(SUM(CASE WHEN v.metodoPago = com.pos.calzados.entity.MetodoPago.EFECTIVO THEN v.total ELSE 0 END), 0), "
                     +
                     "COALESCE(SUM(CASE WHEN v.metodoPago = com.pos.calzados.entity.MetodoPago.YAPE THEN v.total ELSE 0 END), 0), "
                     +
                     "COALESCE(SUM(CASE WHEN v.metodoPago = com.pos.calzados.entity.MetodoPago.TARJETA THEN v.total ELSE 0 END), 0) "
                     +
                     "FROM Venta v WHERE v.fecha BETWEEN :inicio AND :fin " +
                     "GROUP BY v.cajero.id, v.cajero.nombre ORDER BY COALESCE(SUM(v.total), 0) DESC")
       List<Object[]> reporteVentasPorCajero(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       @Query("SELECT DATE(v.fecha), v.cajero.id, v.cajero.nombre, COUNT(v), COALESCE(SUM(v.total), 0) " +
                     "FROM Venta v WHERE v.fecha BETWEEN :inicio AND :fin " +
                     "GROUP BY DATE(v.fecha), v.cajero.id, v.cajero.nombre " +
                     "ORDER BY DATE(v.fecha) DESC, COALESCE(SUM(v.total), 0) DESC")
       List<Object[]> reporteVentasPorCajeroDia(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       @Query("SELECT v.metodoPago, COUNT(v), COALESCE(SUM(v.total), 0) " +
                     "FROM Venta v WHERE v.fecha BETWEEN :inicio AND :fin " +
                     "GROUP BY v.metodoPago ORDER BY COALESCE(SUM(v.total), 0) DESC")
       List<Object[]> reporteMetodosPago(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       @Query("""
                     SELECT new com.pos.calzados.dto.response.UtilidadBaseDTO(
                         COALESCE(SUM(v.total), 0),
                         COALESCE(SUM(COALESCE(dv.costoUnitario, 0) * dv.cantidad), 0)
                     )
                     FROM Venta v
                     JOIN v.detalles dv
                     WHERE v.fecha BETWEEN :inicio AND :fin
                     """)
       UtilidadBaseDTO resumenUtilidad(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       @Query("SELECT dv.variante.talla, COALESCE(SUM(dv.cantidad), 0), COALESCE(SUM(dv.subtotal), 0) " +
                     "FROM DetalleVenta dv WHERE dv.venta.fecha BETWEEN :inicio AND :fin " +
                     "GROUP BY dv.variante.talla ORDER BY COALESCE(SUM(dv.cantidad), 0) DESC")
       List<Object[]> reporteVentasPorTalla(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       @Query("SELECT DISTINCT dv.variante.id FROM DetalleVenta dv WHERE dv.venta.fecha BETWEEN :inicio AND :fin")
       List<Long> variantesVendidasEnRango(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       @Query("SELECT dv.variante.id, dv.variante.producto.nombre, " +
                     "COALESCE(dv.variante.producto.marca.nombre, 'Sin marca'), dv.variante.talla, dv.variante.color, "
                     +
                     "dv.variante.sku, COALESCE(SUM(dv.cantidad), 0), COALESCE(SUM(dv.subtotal), 0) " +
                     "FROM DetalleVenta dv WHERE dv.venta.fecha BETWEEN :inicio AND :fin " +
                     "GROUP BY dv.variante.id, dv.variante.producto.nombre, dv.variante.producto.marca.nombre, dv.variante.talla, dv.variante.color, dv.variante.sku "
                     +
                     "ORDER BY COALESCE(SUM(dv.cantidad), 0) DESC")
       List<Object[]> reporteVentasPorVariante(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);

       // Reporte: ventas por producto en rango de fechas
       @Query("SELECT dv.variante.id, dv.variante.producto.nombre, dv.variante.talla, dv.variante.color, " +
                     "SUM(dv.cantidad), SUM(dv.subtotal) " +
                     "FROM DetalleVenta dv WHERE dv.venta.fecha BETWEEN :inicio AND :fin " +
                     "GROUP BY dv.variante.id, dv.variante.producto.nombre, dv.variante.talla, dv.variante.color " +
                     "ORDER BY SUM(dv.subtotal) DESC")
       List<Object[]> reporteVentasPorProducto(@Param("inicio") LocalDateTime inicio,
                     @Param("fin") LocalDateTime fin);
}
