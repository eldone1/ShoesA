package com.pos.calzados.repository;

import com.pos.calzados.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByActivoTrue();

    @Query("SELECT p FROM Producto p JOIN FETCH p.marca WHERE p.id = :id AND p.activo = true")
    Optional<Producto> findByIdAndActivoTrue(@Param("id") Long id);

    @Query("SELECT p FROM Producto p JOIN FETCH p.marca m WHERE p.activo = true AND " +
           "(:nombre IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
           "(:marcaId IS NULL OR m.id = :marcaId)")
    List<Producto> buscarProductos(@Param("nombre") String nombre, @Param("marcaId") Long marcaId);
}
