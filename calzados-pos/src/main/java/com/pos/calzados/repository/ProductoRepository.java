package com.pos.calzados.repository;

import com.pos.calzados.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Page<Producto> findByActivoTrue(Pageable pageable);

    @Query("SELECT p FROM Producto p JOIN FETCH p.marca WHERE p.id = :id AND p.activo = true")
    Optional<Producto> findByIdAndActivoTrue(@Param("id") Long id);

    @Query(value = "SELECT p FROM Producto p JOIN FETCH p.marca m WHERE p.activo = true AND " +
           "(:nombre IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
           "(:marcaId IS NULL OR m.id = :marcaId)",
           countQuery = "SELECT COUNT(p) FROM Producto p JOIN p.marca m WHERE p.activo = true AND " +
           "(:nombre IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
           "(:marcaId IS NULL OR m.id = :marcaId)")
    Page<Producto> buscarProductos(@Param("nombre") String nombre, @Param("marcaId") Long marcaId, Pageable pageable);
}
