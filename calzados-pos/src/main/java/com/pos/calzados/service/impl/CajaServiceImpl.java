package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.AperturaCajaRequest;
import com.pos.calzados.dto.request.CierreCajaRequest;
import com.pos.calzados.dto.response.CajaResponse;
import com.pos.calzados.entity.Caja;
import com.pos.calzados.entity.EstadoCaja;
import com.pos.calzados.entity.MetodoPago;
import com.pos.calzados.entity.User;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.mapper.CajaMapper;
import com.pos.calzados.repository.CajaRepository;
import com.pos.calzados.repository.UserRepository;
import com.pos.calzados.repository.VentaRepository;
import com.pos.calzados.service.CajaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CajaServiceImpl implements CajaService {

    private final CajaRepository cajaRepository;
    private final UserRepository userRepository;
    private final VentaRepository ventaRepository;
    private final CajaMapper cajaMapper;

    @Override
    public CajaResponse abrir(AperturaCajaRequest request, Long cajeroId) {
        if (cajaRepository.existsByCajeroIdAndEstado(cajeroId, EstadoCaja.ABIERTA)) {
            throw new BusinessException("Ya tienes una caja abierta. Debes cerrarla antes de abrir una nueva.");
        }

        User cajero = userRepository.findById(cajeroId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", cajeroId));

        Caja caja = Caja.builder()
                .cajero(cajero)
                .montoInicial(request.getMontoInicial())
                .estado(EstadoCaja.ABIERTA)
                .build();

        return toResponseConTotales(cajaRepository.save(caja));
    }

//    @Override
//    public CajaResponse cerrar(Long cajaId, CierreCajaRequest request, Long cajeroId) {
//        Caja caja = cajaRepository.findById(cajaId)
//                .orElseThrow(() -> new ResourceNotFoundException("Caja", cajaId));
//
//        if (!caja.getCajero().getId().equals(cajeroId)) {
//            throw new BusinessException("No puedes cerrar una caja que no te pertenece.");
//        }
//
//        if (caja.getEstado() == EstadoCaja.CERRADA) {
//            throw new BusinessException("La caja ya se encuentra cerrada.");
//        }
//
//        // Calcular totales por método de pago
//        BigDecimal totalEfectivo  = ventaRepository.sumTotalByCajaAndMetodo(cajaId, MetodoPago.EFECTIVO);
//        BigDecimal totalYape      = ventaRepository.sumTotalByCajaAndMetodo(cajaId, MetodoPago.YAPE);
//        BigDecimal totalTarjeta   = ventaRepository.sumTotalByCajaAndMetodo(cajaId, MetodoPago.TARJETA);
//
//        // Monto esperado = monto inicial + ventas en efectivo
//        BigDecimal montoFinalEsperado = caja.getMontoInicial().add(totalEfectivo);
//
//        BigDecimal diferencia = request.getMontoFinalReal().subtract(montoFinalEsperado);
//
//        caja.setTotalEfectivo(totalEfectivo);
//        caja.setTotalYape(totalYape);
//        caja.setTotalTarjeta(totalTarjeta);
//        caja.setMontoFinalEsperado(montoFinalEsperado);
//        caja.setMontoFinalReal(request.getMontoFinalReal());
//        caja.setDiferencia(diferencia);
//        caja.setCierre(LocalDateTime.now());
//        caja.setEstado(EstadoCaja.CERRADA);
//
//        return toResponseConTotales(cajaRepository.save(caja));
//    }

    @Override
    public CajaResponse cerrar(Long cajaId, CierreCajaRequest request, Long cajeroId) {
        Caja caja = cajaRepository.findById(cajaId)
                .orElseThrow(() -> new ResourceNotFoundException("Caja", cajaId));

        if (!caja.getCajero().getId().equals(cajeroId)) {
            throw new BusinessException("No puedes cerrar una caja que no te pertenece.");
        }

        if (caja.getEstado() == EstadoCaja.CERRADA) {
            throw new BusinessException("La caja ya se encuentra cerrada.");
        }

        // 🔥 Calcular totales SIEMPRE
        BigDecimal totalEfectivo = Optional.ofNullable(
                ventaRepository.sumTotalByCajaAndMetodo(cajaId, MetodoPago.EFECTIVO)
        ).orElse(BigDecimal.ZERO);

        BigDecimal totalYape = Optional.ofNullable(
                ventaRepository.sumTotalByCajaAndMetodo(cajaId, MetodoPago.YAPE)
        ).orElse(BigDecimal.ZERO);

        BigDecimal totalTarjeta = Optional.ofNullable(
                ventaRepository.sumTotalByCajaAndMetodo(cajaId, MetodoPago.TARJETA)
        ).orElse(BigDecimal.ZERO);

        BigDecimal montoFinalEsperado = caja.getMontoInicial().add(totalEfectivo);

        // 🔥 SETEAR SIEMPRE (aunque no cierre)
        caja.setTotalEfectivo(totalEfectivo);
        caja.setTotalYape(totalYape);
        caja.setTotalTarjeta(totalTarjeta);
        caja.setMontoFinalEsperado(montoFinalEsperado);

        // 🧠 SI NO VIENE MONTO → SOLO CALCULAR (NO CERRAR)
        if (request.getMontoFinalReal() == null) {
            return toResponseConTotales(caja);
        }

        // 🔒 CIERRE REAL
        BigDecimal diferencia = request.getMontoFinalReal().subtract(montoFinalEsperado);

        caja.setMontoFinalReal(request.getMontoFinalReal());
        caja.setDiferencia(diferencia);
        caja.setCierre(LocalDateTime.now());
        caja.setEstado(EstadoCaja.CERRADA);

        return toResponseConTotales(cajaRepository.save(caja));
    }

    @Override
    @Transactional(readOnly = true)
    public CajaResponse obtenerCajaAbiertaPorCajero(Long cajeroId) {
        Caja caja = cajaRepository.findByCajeroIdAndEstado(cajeroId, EstadoCaja.ABIERTA)
                .orElseThrow(() -> new BusinessException("No tienes ninguna caja abierta."));
        return toResponseConTotales(caja);
    }

    @Override
    @Transactional(readOnly = true)
    public CajaResponse obtenerPorId(Long id) {
        Caja caja = cajaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Caja", id));
        return toResponseConTotales(caja);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CajaResponse> listar() {
        return cajaRepository.findAll().stream()
                .map(this::toResponseConTotales)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CajaResponse> listarPorFecha(LocalDate inicio, LocalDate fin) {
        LocalDateTime desde = inicio.atStartOfDay();
        LocalDateTime hasta = fin.atTime(LocalTime.MAX);
        return cajaRepository.findByRangoFecha(desde, hasta).stream()
                .map(this::toResponseConTotales)
                .collect(Collectors.toList());
    }

    // ─── Helper ──────────────────────────────────────────────────────────────────

    private CajaResponse toResponseConTotales(Caja caja) {
        CajaResponse response = cajaMapper.toResponse(caja);
        BigDecimal totalVentas = ventaRepository.sumTotalByCaja(caja.getId());
        response.setTotalVentas(totalVentas != null ? totalVentas : BigDecimal.ZERO);
        return response;
    }
}
