package com.pos.calzados.service;

import com.pos.calzados.dto.request.RecepcionMercaderiaRequest;
import com.pos.calzados.dto.request.SolicitudCompraRequest;
import com.pos.calzados.dto.response.SolicitudCompraResponse;
import com.pos.calzados.entity.EstadoSolicitudCompra;

import java.time.LocalDate;
import java.util.List;

public interface SolicitudCompraService {
    SolicitudCompraResponse crear(SolicitudCompraRequest request, Long userId);
    SolicitudCompraResponse obtenerPorId(Long id);
    List<SolicitudCompraResponse> listar(Long proveedorId, EstadoSolicitudCompra estado, Boolean pagado,
                                         LocalDate desde, LocalDate hasta);
    SolicitudCompraResponse recepcionar(Long id, RecepcionMercaderiaRequest request);
    SolicitudCompraResponse marcarPagado(Long id, boolean pagado);
}
