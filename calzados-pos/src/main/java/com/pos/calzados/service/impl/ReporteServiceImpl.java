package com.pos.calzados.service.impl;

import com.pos.calzados.dto.response.CajaResponse;
import com.pos.calzados.dto.response.ReporteVentaProductoResponse;
import com.pos.calzados.dto.response.VentaResponse;
import com.pos.calzados.entity.MetodoPago;
import com.pos.calzados.entity.Variante;
import com.pos.calzados.mapper.VarianteMapper;
import com.pos.calzados.repository.VentaRepository;
import com.pos.calzados.repository.VarianteRepository;
import com.pos.calzados.service.CajaService;
import com.pos.calzados.service.ReporteService;
import com.pos.calzados.service.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReporteServiceImpl implements ReporteService {

    private final VentaRepository ventaRepository;
    private final VarianteRepository varianteRepository;
    private final VentaService ventaService;
    private final CajaService cajaService;
    private final VarianteMapper varianteMapper;

    @Override
    public List<ReporteVentaProductoResponse> ventasPorProducto(LocalDate inicio, LocalDate fin) {
        LocalDateTime desde = inicio.atStartOfDay();
        LocalDateTime hasta = fin.atTime(LocalTime.MAX);

        return ventaRepository.reporteVentasPorProducto(desde, hasta)
                .stream()
                .map(row -> new ReporteVentaProductoResponse(
                        (Long)   row[0],
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        ((Number) row[4]).longValue(),
                        (BigDecimal) row[5]
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> resumenDiario(LocalDate fecha) {
        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin    = fecha.atTime(LocalTime.MAX);

        BigDecimal totalEfectivo = ventaRepository.findByRangoFecha(inicio, fin)
                .stream()
                .filter(v -> v.getMetodoPago() == MetodoPago.EFECTIVO)
                .map(v -> v.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalYape = ventaRepository.findByRangoFecha(inicio, fin)
                .stream()
                .filter(v -> v.getMetodoPago() == MetodoPago.YAPE)
                .map(v -> v.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTarjeta = ventaRepository.findByRangoFecha(inicio, fin)
                .stream()
                .filter(v -> v.getMetodoPago() == MetodoPago.TARJETA)
                .map(v -> v.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalGeneral = totalEfectivo.add(totalYape).add(totalTarjeta);

        long cantidadVentas = ventaRepository.findByRangoFecha(inicio, fin).size();

        Map<String, Object> resumen = new HashMap<>();
        resumen.put("fecha", fecha.toString());
        resumen.put("cantidadVentas", cantidadVentas);
        resumen.put("totalEfectivo", totalEfectivo);
        resumen.put("totalYape", totalYape);
        resumen.put("totalTarjeta", totalTarjeta);
        resumen.put("totalGeneral", totalGeneral);
        return resumen;
    }

    @Override
    public List<VentaResponse> ventasDelDia(LocalDate fecha) {
        return ventaService.listarPorFecha(fecha, fecha);
    }

    @Override
    public List<CajaResponse> cajasPorRango(LocalDate inicio, LocalDate fin) {
        return cajaService.listarPorFecha(inicio, fin);
    }

    @Override
    public List<Map<String, Object>> stockBajo() {
        List<Variante> variantes = varianteRepository.findVariantesConStockBajo();
        return variantes.stream().map(v -> {
            Map<String, Object> item = new HashMap<>();
            item.put("varianteId", v.getId());
            item.put("productoNombre", v.getProducto().getNombre());
            item.put("marcaNombre", v.getProducto().getMarca() != null
                    ? v.getProducto().getMarca().getNombre() : null);
            item.put("talla", v.getTalla());
            item.put("color", v.getColor());
            item.put("sku", v.getSku());
            item.put("codigoBarras", v.getCodigoBarras());
            item.put("stockActual", v.getStock());
            item.put("stockMinimo", v.getStockMinimo());
            return item;
        }).collect(Collectors.toList());
    }
}
