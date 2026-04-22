package com.pos.calzados.repository;

import com.pos.calzados.entity.Gasto;
import com.pos.calzados.entity.TipoGasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    List<Gasto> findByFechaGastoBetweenOrderByFechaGastoDescCreatedAtDesc(LocalDate desde, LocalDate hasta);

    @Query("SELECT COALESCE(SUM(g.monto), 0) FROM Gasto g WHERE g.fechaGasto BETWEEN :desde AND :hasta")
    BigDecimal sumMontoByFechaGastoBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);

    @Query("SELECT COALESCE(SUM(g.monto), 0) FROM Gasto g WHERE g.fechaGasto BETWEEN :desde AND :hasta AND g.tipo = :tipo")
    BigDecimal sumMontoByFechaGastoBetweenAndTipo(@Param("desde") LocalDate desde,
                                                  @Param("hasta") LocalDate hasta,
                                                  @Param("tipo") TipoGasto tipo);
}
