package com.pos.calzados.config;

import com.pos.calzados.entity.Rol;
import com.pos.calzados.entity.User;
import com.pos.calzados.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminUserSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_NAME:Administrador}")
    private String adminName;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adminName == null || adminName.isBlank()
                || adminEmail == null || adminEmail.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {
            log.warn("No se creó el usuario ADMIN porque ADMIN_NAME, ADMIN_EMAIL o ADMIN_PASSWORD está vacío");
            return;
        }

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("El usuario ADMIN inicial ya existe: {}", adminEmail);
            return;
        }

        User admin = User.builder()
                .nombre(adminName.trim())
                .email(adminEmail.trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(adminPassword))
                .rol(Rol.ADMIN)
                .activo(true)
                .build();

        userRepository.save(admin);
        log.info("Usuario ADMIN inicial creado correctamente: {}", adminEmail);
    }
}