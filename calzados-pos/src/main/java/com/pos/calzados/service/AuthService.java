package com.pos.calzados.service;

import com.pos.calzados.dto.request.LoginRequest;
import com.pos.calzados.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
