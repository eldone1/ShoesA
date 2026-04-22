package com.pos.calzados.service;

import com.pos.calzados.dto.request.ProveedorRequest;
import com.pos.calzados.dto.response.ProveedorResponse;

import java.util.List;

public interface ProveedorService {
    List<ProveedorResponse> listar(Boolean incluirInactivos, String q);
    ProveedorResponse obtenerPorId(Long id);
    ProveedorResponse crear(ProveedorRequest request);
    ProveedorResponse actualizar(Long id, ProveedorRequest request);
    void cambiarEstado(Long id, boolean activo);
}
