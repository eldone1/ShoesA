package com.pos.calzados.service;

import com.pos.calzados.dto.request.UserRequest;
import com.pos.calzados.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse crear(UserRequest request);
    UserResponse actualizar(Long id, UserRequest request);
    UserResponse obtenerPorId(Long id);
    List<UserResponse> listar();
    void cambiarEstado(Long id, boolean activo);
}
