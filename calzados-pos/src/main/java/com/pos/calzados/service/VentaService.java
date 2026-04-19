package com.pos.calzados.service;

import com.pos.calzados.dto.request.VentaRequest;
import com.pos.calzados.dto.response.VentaResponse;

import java.time.LocalDate;
import java.util.List;

public interface VentaService {
    VentaResponse registrar(VentaRequest request, Long cajeroId);
    VentaResponse obtenerPorId(Long id);
    List<VentaResponse> listarPorCaja(Long cajaId);
    List<VentaResponse> listarPorFecha(LocalDate inicio, LocalDate fin);
    List<VentaResponse> listarPorCajeroYFecha(Long cajeroId, LocalDate inicio, LocalDate fin);
}
