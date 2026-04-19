package com.pos.calzados.mapper;

import com.pos.calzados.dto.response.CajaResponse;
import com.pos.calzados.entity.Caja;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CajaMapper {

    @Mapping(target = "totalVentas", ignore = true) // calculado en servicio
    CajaResponse toResponse(Caja caja);

    List<CajaResponse> toResponseList(List<Caja> cajas);
}
