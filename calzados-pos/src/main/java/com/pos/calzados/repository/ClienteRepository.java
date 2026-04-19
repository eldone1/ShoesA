package com.pos.calzados.repository;

import com.pos.calzados.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByDni(String dni);
    Optional<Cliente> findByRuc(String ruc);

    boolean existsByDni(String dni);
    boolean existsByRuc(String ruc);
    boolean existsByDniAndIdNot(String dni, Long id);
    boolean existsByRucAndIdNot(String ruc, Long id);

    List<Cliente> findByActivoTrue();

    @Query("""
        SELECT c FROM Cliente c
        WHERE c.activo = true AND (
            LOWER(c.nombre)       LIKE LOWER(CONCAT('%', :q, '%')) OR
            LOWER(c.razonSocial)  LIKE LOWER(CONCAT('%', :q, '%')) OR
            c.dni                 LIKE CONCAT('%', :q, '%')        OR
            c.ruc                 LIKE CONCAT('%', :q, '%')        OR
            LOWER(c.email)        LIKE LOWER(CONCAT('%', :q, '%'))
        )
        ORDER BY c.nombre
        """)
    List<Cliente> buscar(@Param("q") String q);
}
