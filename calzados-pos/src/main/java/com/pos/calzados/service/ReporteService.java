package com.pos.calzados.service;

import com.pos.calzados.dto.response.CajaResponse;
import com.pos.calzados.dto.response.ReporteInventarioActualResponse;
import com.pos.calzados.dto.response.ReporteMetodoPagoResponse;
import com.pos.calzados.dto.response.ReporteProductoSinRotacionResponse;
import com.pos.calzados.dto.response.ReporteUtilidadResponse;
import com.pos.calzados.dto.response.ReporteVentasPorCajeroDiaResponse;
import com.pos.calzados.dto.response.ReporteVentasPorCajeroResponse;
import com.pos.calzados.dto.response.ReporteVentaProductoResponse;
import com.pos.calzados.dto.response.ReporteVentasPorDiaResponse;
import com.pos.calzados.dto.response.ReporteVentasPorMesResponse;
import com.pos.calzados.dto.response.ReporteVentasPorTallaResponse;
import com.pos.calzados.dto.response.VentaResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ReporteService {
    List<ReporteVentaProductoResponse> ventasPorProducto(LocalDate inicio, LocalDate fin);
    List<ReporteVentasPorDiaResponse> ventasPorDia(LocalDate inicio, LocalDate fin);
    List<ReporteVentasPorMesResponse> ventasPorMes(LocalDate inicio, LocalDate fin);
    Map<String, Object> resumenDiario(LocalDate fecha);
    List<VentaResponse> ventasDelDia(LocalDate fecha);
    List<CajaResponse> cajasPorRango(LocalDate inicio, LocalDate fin);
    ReporteUtilidadResponse utilidad(LocalDate inicio, LocalDate fin);
    List<ReporteVentasPorTallaResponse> ventasPorTalla(LocalDate inicio, LocalDate fin);
    List<ReporteInventarioActualResponse> inventarioActual();
    List<ReporteInventarioActualResponse> productosAgotados();
    List<ReporteProductoSinRotacionResponse> productosSinRotacion(LocalDate inicio, LocalDate fin);
    List<ReporteVentasPorCajeroResponse> ventasPorCajero(LocalDate inicio, LocalDate fin);
    List<ReporteVentasPorCajeroDiaResponse> ventasPorCajeroDia(LocalDate inicio, LocalDate fin);
    List<ReporteMetodoPagoResponse> metodosPago(LocalDate inicio, LocalDate fin);
    List<Map<String, Object>> stockBajo();
    List<Map<String, Object>> ingresosInventario(LocalDate desde, LocalDate hasta);
}
