package com.pos.calzados.service;

import com.pos.calzados.dto.request.GastoRequest;
import com.pos.calzados.dto.response.GastoResponse;
import com.pos.calzados.dto.response.PageResponse;
import com.pos.calzados.dto.response.ResumenGastosMesResponse;

import java.util.List;

public interface GastoService {
    GastoResponse crear(GastoRequest request, Long userId);
    List<GastoResponse> listarMes(int year, int month);
    PageResponse<GastoResponse> listarMesPaginado(int year, int month, int page, int size);
    ResumenGastosMesResponse resumenMes(int year, int month);
    GastoResponse obtenerPorId(Long id);
    GastoResponse actualizar(Long id, GastoRequest request);
    void eliminar(Long id);
}
