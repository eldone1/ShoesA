package com.pos.calzados.service;

import com.pos.calzados.dto.request.ComprobanteRequest;
import com.pos.calzados.dto.response.ComprobanteResponse;
import com.pos.calzados.entity.Rol;
import com.pos.calzados.entity.TipoComprobante;

import java.time.LocalDate;
import java.util.List;

public interface ComprobanteService {
    ComprobanteResponse emitir(ComprobanteRequest request);
    ComprobanteResponse obtenerPorId(Long id, Long userId, Rol rol);
    ComprobanteResponse obtenerPorSerie(String serie, Long userId, Rol rol);
    ComprobanteResponse obtenerPorVentaId(Long ventaId, Long userId, Rol rol);
    List<ComprobanteResponse> listarPorFecha(LocalDate inicio, LocalDate fin, TipoComprobante tipo, Long userId, Rol rol);
    List<ComprobanteResponse> listarPorCliente(Long clienteId, Long userId, Rol rol);
}
