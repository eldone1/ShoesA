package com.pos.calzados.service;

import com.pos.calzados.dto.request.MarcaRequest;
import com.pos.calzados.dto.response.MarcaResponse;

import java.util.List;

public interface MarcaService {
    MarcaResponse crear(MarcaRequest request);
    MarcaResponse actualizar(Long id, MarcaRequest request);
    MarcaResponse obtenerPorId(Long id);
    List<MarcaResponse> listar();
    List<MarcaResponse> listarActivas();
    void eliminar(Long id);
}
