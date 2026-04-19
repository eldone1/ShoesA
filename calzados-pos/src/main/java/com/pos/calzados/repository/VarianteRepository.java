package com.pos.calzados.repository;

import com.pos.calzados.entity.Variante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VarianteRepository extends JpaRepository<Variante, Long> {

    Optional<Variante> findByCodigoBarras(String codigoBarras);

    Optional<Variante> findBySku(String sku);

    boolean existsByCodigoBarras(String codigoBarras);

    boolean existsBySku(String sku);

    boolean existsByCodigoBarrasAndIdNot(String codigoBarras, Long id);

    boolean existsBySkuAndIdNot(String sku, Long id);

    List<Variante> findByProductoId(Long productoId);

    @Query("SELECT v FROM Variante v JOIN FETCH v.producto p JOIN FETCH p.marca " +
           "WHERE v.codigoBarras = :codigoBarras AND v.stock > 0")
    Optional<Variante> findByCodigoBarrasConStock(@Param("codigoBarras") String codigoBarras);

    @Query("SELECT v FROM Variante v WHERE v.stock <= v.stockMinimo AND v.producto.activo = true")
    List<Variante> findVariantesConStockBajo();
}
