package com.pos.calzados.mapper;

import com.pos.calzados.dto.request.VarianteRequest;
import com.pos.calzados.dto.response.VarianteResponse;
import com.pos.calzados.entity.Variante;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VarianteMapper {

    @Mapping(target = "productoNombre", expression = "java(variante.getProducto() != null ? variante.getProducto().getNombre() : null)")
    @Mapping(target = "stockBajo", expression = "java(variante.getStock() <= variante.getStockMinimo())")
    VarianteResponse toResponse(Variante variante);

    List<VarianteResponse> toResponseList(List<Variante> variantes);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "producto", ignore = true)
    @Mapping(target = "precioVenta", ignore = true) // calculado en el servicio
    @Mapping(target = "activo", constant = "true")
    Variante toEntity(VarianteRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "producto", ignore = true)
    @Mapping(target = "precioVenta", ignore = true)

    void updateEntity(VarianteRequest request, @MappingTarget Variante variante);
}
