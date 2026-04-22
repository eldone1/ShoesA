package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.ProveedorRequest;
import com.pos.calzados.dto.response.ProveedorResponse;
import com.pos.calzados.entity.Proveedor;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.repository.ProveedorRepository;
import com.pos.calzados.service.ProveedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProveedorServiceImpl implements ProveedorService {

    private final ProveedorRepository proveedorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProveedorResponse> listar(Boolean incluirInactivos, String q) {
        List<Proveedor> data;

        if (q != null && !q.isBlank()) {
            data = proveedorRepository.buscar(q.trim());
            if (!Boolean.TRUE.equals(incluirInactivos)) {
                data = data.stream().filter(Proveedor::getActivo).toList();
            }
        } else if (Boolean.TRUE.equals(incluirInactivos)) {
            data = proveedorRepository.findAll();
        } else {
            data = proveedorRepository.findByActivoTrue();
        }

        return data.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProveedorResponse obtenerPorId(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", id));
        return toResponse(proveedor);
    }

    @Override
    public ProveedorResponse crear(ProveedorRequest request) {
        if (proveedorRepository.existsByRuc(request.getRuc())) {
            throw new BusinessException("Ya existe un proveedor con el RUC " + request.getRuc());
        }

        Proveedor proveedor = Proveedor.builder()
                .nombre(request.getNombre().trim())
                .ruc(request.getRuc().trim())
                .contacto(request.getContacto().trim())
                .numeroTelefono(request.getNumeroTelefono().trim())
                .email(request.getEmail().trim())
                .direccion(request.getDireccion().trim())
                .diasCredito(request.getDiasCredito() == null ? 0 : request.getDiasCredito())
                .activo(true)
                .build();

        return toResponse(proveedorRepository.save(proveedor));
    }

    @Override
    public ProveedorResponse actualizar(Long id, ProveedorRequest request) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", id));

        if (proveedorRepository.existsByRucAndIdNot(request.getRuc(), id)) {
            throw new BusinessException("Ya existe otro proveedor con el RUC " + request.getRuc());
        }

        proveedor.setNombre(request.getNombre().trim());
        proveedor.setRuc(request.getRuc().trim());
        proveedor.setContacto(request.getContacto().trim());
        proveedor.setNumeroTelefono(request.getNumeroTelefono().trim());
        proveedor.setEmail(request.getEmail().trim());
        proveedor.setDireccion(request.getDireccion().trim());
        proveedor.setDiasCredito(request.getDiasCredito() == null ? 0 : request.getDiasCredito());

        return toResponse(proveedorRepository.save(proveedor));
    }

    @Override
    public void cambiarEstado(Long id, boolean activo) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", id));
        proveedor.setActivo(activo);
        proveedorRepository.save(proveedor);
    }

    private ProveedorResponse toResponse(Proveedor p) {
        return ProveedorResponse.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .ruc(p.getRuc())
                .contacto(p.getContacto())
                .numeroTelefono(p.getNumeroTelefono())
                .email(p.getEmail())
                .direccion(p.getDireccion())
                .diasCredito(p.getDiasCredito())
                .activo(p.getActivo())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
