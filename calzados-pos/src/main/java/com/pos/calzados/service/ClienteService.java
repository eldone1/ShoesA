package com.pos.calzados.service;

import com.pos.calzados.dto.request.ClienteRequest;
import com.pos.calzados.dto.response.ClienteResponse;

import java.util.List;

public interface ClienteService {
    ClienteResponse crear(ClienteRequest request);
    ClienteResponse actualizar(Long id, ClienteRequest request);
    ClienteResponse obtenerPorId(Long id);
    ClienteResponse obtenerPorDni(String dni);
    List<ClienteResponse> listar();
    List<ClienteResponse> buscar(String q);
    void cambiarEstado(Long id, boolean activo);
}
