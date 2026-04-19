package com.pos.calzados.service;

import com.pos.calzados.dto.request.ComprobanteRequest;
import com.pos.calzados.dto.response.ComprobanteResponse;
import com.pos.calzados.entity.TipoComprobante;

import java.time.LocalDate;
import java.util.List;

public interface ComprobanteService {
    ComprobanteResponse emitir(ComprobanteRequest request);
    ComprobanteResponse obtenerPorId(Long id);
    ComprobanteResponse obtenerPorSerie(String serie);
    ComprobanteResponse obtenerPorVentaId(Long ventaId);
    List<ComprobanteResponse> listarPorFecha(LocalDate inicio, LocalDate fin, TipoComprobante tipo);
    List<ComprobanteResponse> listarPorCliente(Long clienteId);
}
