package com.pos.calzados.service;

import com.pos.calzados.dto.response.CajaResponse;
import com.pos.calzados.dto.response.ReporteVentaProductoResponse;
import com.pos.calzados.dto.response.VentaResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ReporteService {
    List<ReporteVentaProductoResponse> ventasPorProducto(LocalDate inicio, LocalDate fin);
    Map<String, Object> resumenDiario(LocalDate fecha);
    List<VentaResponse> ventasDelDia(LocalDate fecha);
    List<CajaResponse> cajasPorRango(LocalDate inicio, LocalDate fin);
    List<Map<String, Object>> stockBajo();
}
