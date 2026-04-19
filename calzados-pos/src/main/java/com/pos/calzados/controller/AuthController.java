package com.pos.calzados.controller;

import com.pos.calzados.dto.request.LoginRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.AuthResponse;
import com.pos.calzados.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login
     * El cajero ingresa email + password; recibe un JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Inicio de sesión exitoso", response));
    }
}
