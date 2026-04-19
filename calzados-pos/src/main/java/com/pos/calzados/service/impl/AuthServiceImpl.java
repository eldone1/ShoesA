package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.LoginRequest;
import com.pos.calzados.dto.response.AuthResponse;
import com.pos.calzados.entity.User;
import com.pos.calzados.security.JwtUtil;
import com.pos.calzados.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .userId(user.getId())
                .nombre(user.getNombre())
                .email(user.getEmail())
                .rol(user.getRol())
                .build();
    }
}
