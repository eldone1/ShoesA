package com.pos.calzados.service;

import com.pos.calzados.dto.request.AperturaCajaRequest;
import com.pos.calzados.dto.request.CierreCajaRequest;
import com.pos.calzados.dto.response.CajaResponse;

import java.time.LocalDate;
import java.util.List;

public interface CajaService {
    CajaResponse abrir(AperturaCajaRequest request, Long cajeroId);
    CajaResponse cerrar(Long cajaId, CierreCajaRequest request, Long cajeroId);
    CajaResponse obtenerCajaAbiertaPorCajero(Long cajeroId);
    CajaResponse obtenerPorId(Long id);
    List<CajaResponse> listar();
    List<CajaResponse> listarPorFecha(LocalDate inicio, LocalDate fin);
}
