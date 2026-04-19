package com.pos.calzados.repository;

import com.pos.calzados.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Long> {
    List<Marca> findByActivoTrue();
    boolean existsByNombreIgnoreCase(String nombre);
}
