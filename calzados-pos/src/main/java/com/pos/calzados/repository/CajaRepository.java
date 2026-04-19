package com.pos.calzados.repository;

import com.pos.calzados.entity.Caja;
import com.pos.calzados.entity.EstadoCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CajaRepository extends JpaRepository<Caja, Long> {

    Optional<Caja> findByCajeroIdAndEstado(Long cajeroId, EstadoCaja estado);

    boolean existsByCajeroIdAndEstado(Long cajeroId, EstadoCaja estado);

    @Query("SELECT c FROM Caja c JOIN FETCH c.cajero WHERE c.estado = :estado")
    List<Caja> findByEstado(@Param("estado") EstadoCaja estado);

    @Query("SELECT c FROM Caja c JOIN FETCH c.cajero " +
           "WHERE c.apertura BETWEEN :inicio AND :fin ORDER BY c.apertura DESC")
    List<Caja> findByRangoFecha(@Param("inicio") LocalDateTime inicio,
                                 @Param("fin") LocalDateTime fin);


}
