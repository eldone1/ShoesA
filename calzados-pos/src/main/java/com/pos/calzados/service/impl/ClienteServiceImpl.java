package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.ClienteRequest;
import com.pos.calzados.dto.response.ClienteResponse;
import com.pos.calzados.entity.Cliente;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.mapper.ClienteMapper;
import com.pos.calzados.repository.ClienteRepository;
import com.pos.calzados.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    @Override
    public ClienteResponse crear(ClienteRequest request) {
        validarUnicidad(request, null);
        Cliente cliente = clienteMapper.toEntity(request);
        return clienteMapper.toResponse(clienteRepository.save(cliente));
    }

    @Override
    public ClienteResponse actualizar(Long id, ClienteRequest request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        validarUnicidad(request, id);
        clienteMapper.updateEntity(request, cliente);
        return clienteMapper.toResponse(clienteRepository.save(cliente));
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse obtenerPorId(Long id) {
        return clienteMapper.toResponse(
                clienteRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente", id))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse obtenerPorDni(String dni) {
        return clienteMapper.toResponse(
                clienteRepository.findByDni(dni)
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente con DNI " + dni + " no encontrado"))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> listar() {
        return clienteMapper.toResponseList(clienteRepository.findByActivoTrue());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> buscar(String q) {
        if (q == null || q.isBlank()) return listar();
        return clienteMapper.toResponseList(clienteRepository.buscar(q.trim()));
    }

    @Override
    public void cambiarEstado(Long id, boolean activo) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        cliente.setActivo(activo);
        clienteRepository.save(cliente);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void validarUnicidad(ClienteRequest request, Long excludeId) {
        if (request.getDni() != null && !request.getDni().isBlank()) {
            boolean existe = excludeId == null
                    ? clienteRepository.existsByDni(request.getDni())
                    : clienteRepository.existsByDniAndIdNot(request.getDni(), excludeId);
            if (existe) throw new BusinessException("Ya existe un cliente con el DNI: " + request.getDni());
        }
        if (request.getRuc() != null && !request.getRuc().isBlank()) {
            boolean existe = excludeId == null
                    ? clienteRepository.existsByRuc(request.getRuc())
                    : clienteRepository.existsByRucAndIdNot(request.getRuc(), excludeId);
            if (existe) throw new BusinessException("Ya existe un cliente con el RUC: " + request.getRuc());
        }
    }
}
