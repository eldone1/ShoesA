package com.pos.calzados.mapper;

import com.pos.calzados.dto.response.ComprobanteResponse;
import com.pos.calzados.entity.Comprobante;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {VentaMapper.class})
public interface ComprobanteMapper {

    @Mapping(source = "venta.id",              target = "ventaId")
    @Mapping(source = "venta.cajero.nombre",   target = "cajeroNombre")
    @Mapping(source = "venta.metodoPago",      target = "metodoPago")
    @Mapping(source = "cliente.id",            target = "clienteId")
    @Mapping(target = "detalles",              ignore = true) // se llena en el servicio
    ComprobanteResponse toResponse(Comprobante comprobante);

    List<ComprobanteResponse> toResponseList(List<Comprobante> comprobantes);
}
