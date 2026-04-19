package com.pos.calzados.mapper;

import com.pos.calzados.dto.response.DetalleVentaResponse;
import com.pos.calzados.dto.response.VentaResponse;
import com.pos.calzados.entity.DetalleVenta;
import com.pos.calzados.entity.Venta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface VentaMapper {

    @Mapping(source = "caja.id", target = "cajaId")
    VentaResponse toResponse(Venta venta);

    List<VentaResponse> toResponseList(List<Venta> ventas);

    @Mapping(source = "variante.id",                       target = "varianteId")
    @Mapping(source = "variante.producto.nombre",          target = "productoNombre")
    @Mapping(source = "variante.producto.marca.nombre",    target = "marcaNombre")
    @Mapping(source = "variante.talla",                    target = "talla")
    @Mapping(source = "variante.color",                    target = "color")
    @Mapping(source = "variante.sku",                      target = "sku")
    @Mapping(source = "variante.codigoBarras",             target = "codigoBarras")
    DetalleVentaResponse toDetalleResponse(DetalleVenta detalle);
}
