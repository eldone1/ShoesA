package com.pos.calzados.service;

import com.pos.calzados.dto.request.VentaRequest;
import com.pos.calzados.dto.response.VentaResponse;
import com.pos.calzados.entity.MetodoPago;

import java.time.LocalDate;
import java.util.List;

public interface VentaService {
    VentaResponse registrar(VentaRequest request, Long cajeroId);
    void cancelarSinComprobante(Long ventaId, Long userId);
    VentaResponse obtenerPorId(Long id);
    List<VentaResponse> listarPorCaja(Long cajaId);
    List<VentaResponse> listarPorFecha(LocalDate inicio, LocalDate fin);
    List<VentaResponse> listarPorFiltros(LocalDate inicio, LocalDate fin, Long cajeroId, MetodoPago metodoPago);
    List<VentaResponse> listarPorCajeroYFecha(Long cajeroId, LocalDate inicio, LocalDate fin);
}
