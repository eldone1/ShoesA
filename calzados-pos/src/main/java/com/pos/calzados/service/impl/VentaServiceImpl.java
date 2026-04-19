package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.DetalleVentaRequest;
import com.pos.calzados.dto.request.VentaRequest;
import com.pos.calzados.dto.response.VentaResponse;
import com.pos.calzados.entity.*;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.mapper.VentaMapper;
import com.pos.calzados.repository.CajaRepository;
import com.pos.calzados.repository.UserRepository;
import com.pos.calzados.repository.VarianteRepository;
import com.pos.calzados.repository.VentaRepository;
import com.pos.calzados.service.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final CajaRepository cajaRepository;
    private final UserRepository userRepository;
    private final VarianteRepository varianteRepository;
    private final VentaMapper ventaMapper;

    @Override
    public VentaResponse registrar(VentaRequest request, Long cajeroId) {

        // 1. Obtener cajero
        User cajero = userRepository.findById(cajeroId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", cajeroId));

        // 2. Obtener caja abierta del cajero
        Caja caja = cajaRepository.findByCajeroIdAndEstado(cajeroId, EstadoCaja.ABIERTA)
                .orElseThrow(() -> new BusinessException(
                        "No tienes una caja abierta. Debes aperturar caja antes de registrar ventas."));

        // 3. Validar método de pago EFECTIVO requiere monto recibido
        if (request.getMetodoPago() == MetodoPago.EFECTIVO) {
            if (request.getMontoRecibido() == null) {
                throw new BusinessException("Para pago en efectivo debes indicar el monto recibido.");
            }
        }

        // 4. Construir detalles y calcular subtotales
        List<DetalleVenta> detalles = new ArrayList<>();
        BigDecimal subtotalVenta = BigDecimal.ZERO;

        for (DetalleVentaRequest dReq : request.getDetalles()) {
            Variante variante = varianteRepository.findById(dReq.getVarianteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variante", dReq.getVarianteId()));

            // Verificar stock
            if (variante.getStock() < dReq.getCantidad()) {
                throw new BusinessException(
                        String.format("Stock insuficiente para '%s' (talla %s, color %s). " +
                                "Stock disponible: %d, solicitado: %d",
                                variante.getProducto().getNombre(),
                                variante.getTalla(),
                                variante.getColor(),
                                variante.getStock(),
                                dReq.getCantidad()));
            }

            // Capturar precio de venta en el momento de la venta (inmutable)
            BigDecimal precioUnitario = variante.getPrecioVenta();
            BigDecimal descuentoItem = dReq.getDescuentoItem() != null
                    ? dReq.getDescuentoItem() : BigDecimal.ZERO;
            BigDecimal subtotalItem = precioUnitario
                    .multiply(BigDecimal.valueOf(dReq.getCantidad()))
                    .subtract(descuentoItem);

            DetalleVenta detalle = DetalleVenta.builder()
                    .variante(variante)
                    .cantidad(dReq.getCantidad())
                    .precioUnitario(precioUnitario)   // precio snapshot — no cambia si luego se edita la variante
                    .descuentoItem(descuentoItem)
                    .subtotal(subtotalItem)
                    .build();

            detalles.add(detalle);
            subtotalVenta = subtotalVenta.add(subtotalItem);

            // Descontar stock
            variante.setStock(variante.getStock() - dReq.getCantidad());
            varianteRepository.save(variante);
        }

        // 5. Calcular total y vuelto
        BigDecimal descuentoGlobal = request.getDescuento() != null
                ? request.getDescuento() : BigDecimal.ZERO;
        BigDecimal total = subtotalVenta.subtract(descuentoGlobal);

        BigDecimal vuelto = BigDecimal.ZERO;
        if (request.getMetodoPago() == MetodoPago.EFECTIVO) {
            if (request.getMontoRecibido().compareTo(total) < 0) {
                throw new BusinessException(
                        String.format("El monto recibido (%.2f) es menor al total de la venta (%.2f).",
                                request.getMontoRecibido(), total));
            }
            vuelto = request.getMontoRecibido().subtract(total);
        }

        // 6. Crear venta
        Venta venta = Venta.builder()
                .caja(caja)
                .cajero(cajero)
                .subtotal(subtotalVenta)
                .descuento(descuentoGlobal)
                .total(total)
                .metodoPago(request.getMetodoPago())
                .montoRecibido(request.getMontoRecibido())
                .vuelto(vuelto)
                .notas(request.getNotas())
                .build();

        // Asociar detalles a la venta
        detalles.forEach(d -> d.setVenta(venta));
        venta.setDetalles(detalles);

        Venta ventaGuardada = ventaRepository.save(venta);
        return buildVentaResponse(ventaGuardada);
    }

    @Override
    @Transactional(readOnly = true)
    public VentaResponse obtenerPorId(Long id) {
        Venta venta = ventaRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta", id));
        return buildVentaResponse(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentaResponse> listarPorCaja(Long cajaId) {
        return ventaRepository.findByCajaId(cajaId).stream()
                .map(this::buildVentaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentaResponse> listarPorFecha(LocalDate inicio, LocalDate fin) {
        LocalDateTime desde = inicio.atStartOfDay();
        LocalDateTime hasta = fin.atTime(LocalTime.MAX);
        return ventaRepository.findByRangoFecha(desde, hasta).stream()
                .map(this::buildVentaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentaResponse> listarPorCajeroYFecha(Long cajeroId, LocalDate inicio, LocalDate fin) {
        LocalDateTime desde = inicio.atStartOfDay();
        LocalDateTime hasta = fin.atTime(LocalTime.MAX);
        return ventaRepository.findByCajeroAndRangoFecha(cajeroId, desde, hasta).stream()
                .map(this::buildVentaResponse)
                .collect(Collectors.toList());
    }

    // ─── Helper ──────────────────────────────────────────────────────────────────

    private VentaResponse buildVentaResponse(Venta venta) {
        VentaResponse response = ventaMapper.toResponse(venta);
        response.setDetalles(
                venta.getDetalles().stream()
                        .map(ventaMapper::toDetalleResponse)
                        .collect(Collectors.toList())
        );
        return response;
    }
}
