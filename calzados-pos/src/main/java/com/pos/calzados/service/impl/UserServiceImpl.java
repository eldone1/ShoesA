package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.UserRequest;
import com.pos.calzados.dto.response.UserResponse;
import com.pos.calzados.entity.User;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.mapper.UserMapper;
import com.pos.calzados.repository.UserRepository;
import com.pos.calzados.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse crear(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El email ya está registrado: " + request.getEmail());
        }
        User user = User.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRol())
                .activo(true)
                .build();
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse actualizar(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));

        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El email ya está en uso: " + request.getEmail());
        }

        user.setNombre(request.getNombre());
        user.setEmail(request.getEmail());
        user.setRol(request.getRol());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse obtenerPorId(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> listar() {
        return userMapper.toResponseList(userRepository.findAll());
    }

    @Override
    public void cambiarEstado(Long id, boolean activo) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        user.setActivo(activo);
        userRepository.save(user);
    }
}
