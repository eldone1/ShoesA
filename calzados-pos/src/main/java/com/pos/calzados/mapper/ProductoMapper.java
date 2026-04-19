package com.pos.calzados.mapper;

import com.pos.calzados.dto.request.ProductoRequest;
import com.pos.calzados.dto.response.ProductoResponse;
import com.pos.calzados.entity.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MarcaMapper.class, VarianteMapper.class})
public interface ProductoMapper {

    ProductoResponse toResponse(Producto producto);

    List<ProductoResponse> toResponseList(List<Producto> productos);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "marca", ignore = true)
    @Mapping(target = "variantes", ignore = true)
    @Mapping(target = "activo", constant = "true")
    Producto toEntity(ProductoRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "marca", ignore = true)
    @Mapping(target = "variantes", ignore = true)

    void updateEntity(ProductoRequest request, @MappingTarget Producto producto);
}
