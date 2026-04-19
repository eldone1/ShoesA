package com.pos.calzados.mapper;

import com.pos.calzados.dto.request.MarcaRequest;
import com.pos.calzados.dto.response.MarcaResponse;
import com.pos.calzados.entity.Marca;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MarcaMapper {

    MarcaResponse toResponse(Marca marca);

    List<MarcaResponse> toResponseList(List<Marca> marcas);

    Marca toEntity(MarcaRequest request);

    void updateEntity(MarcaRequest request, @MappingTarget Marca marca);
}
