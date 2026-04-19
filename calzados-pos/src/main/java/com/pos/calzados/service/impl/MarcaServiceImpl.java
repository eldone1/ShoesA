package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.MarcaRequest;
import com.pos.calzados.dto.response.MarcaResponse;
import com.pos.calzados.entity.Marca;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.mapper.MarcaMapper;
import com.pos.calzados.repository.MarcaRepository;
import com.pos.calzados.service.MarcaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MarcaServiceImpl implements MarcaService {

    private final MarcaRepository marcaRepository;
    private final MarcaMapper marcaMapper;

    @Override
    public MarcaResponse crear(MarcaRequest request) {
        if (marcaRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new BusinessException("Ya existe una marca con el nombre: " + request.getNombre());
        }
        Marca marca = marcaMapper.toEntity(request);
        marca.setActivo(true);
        return marcaMapper.toResponse(marcaRepository.save(marca));
    }

    @Override
    public MarcaResponse actualizar(Long id, MarcaRequest request) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca", id));
        marcaMapper.updateEntity(request, marca);
        return marcaMapper.toResponse(marcaRepository.save(marca));
    }

    @Override
    @Transactional(readOnly = true)
    public MarcaResponse obtenerPorId(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca", id));
        return marcaMapper.toResponse(marca);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarcaResponse> listar() {
        return marcaMapper.toResponseList(marcaRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarcaResponse> listarActivas() {
        return marcaMapper.toResponseList(marcaRepository.findByActivoTrue());
    }

    @Override
    public void eliminar(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca", id));
        marca.setActivo(false);
        marcaRepository.save(marca);
    }
}
