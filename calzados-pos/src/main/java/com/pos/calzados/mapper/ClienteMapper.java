package com.pos.calzados.mapper;

import com.pos.calzados.dto.request.ClienteRequest;
import com.pos.calzados.dto.response.ClienteResponse;
import com.pos.calzados.entity.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClienteMapper {

    ClienteResponse toResponse(Cliente cliente);
    List<ClienteResponse> toResponseList(List<Cliente> clientes);

    @Mapping(target = "id",          ignore = true)
    @Mapping(target = "activo",      constant = "true")
    @Mapping(target = "createdAt",   ignore = true)
    @Mapping(target = "comprobantes",ignore = true)
    Cliente toEntity(ClienteRequest request);

    @Mapping(target = "id",          ignore = true)
    @Mapping(target = "activo",      ignore = true)
    @Mapping(target = "createdAt",   ignore = true)
    @Mapping(target = "comprobantes",ignore = true)
    void updateEntity(ClienteRequest request, @MappingTarget Cliente cliente);
}
