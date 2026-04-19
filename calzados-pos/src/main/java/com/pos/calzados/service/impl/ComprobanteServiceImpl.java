package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.ComprobanteRequest;
import com.pos.calzados.dto.response.ComprobanteResponse;
import com.pos.calzados.entity.*;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.mapper.ComprobanteMapper;
import com.pos.calzados.mapper.VentaMapper;
import com.pos.calzados.repository.ClienteRepository;
import com.pos.calzados.repository.ComprobanteRepository;
import com.pos.calzados.repository.VentaRepository;
import com.pos.calzados.service.ComprobanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ComprobanteServiceImpl implements ComprobanteService {

    private static final BigDecimal IGV_RATE    = new BigDecimal("0.18");
    private static final BigDecimal IGV_DIVISOR = new BigDecimal("1.18");

    private final ComprobanteRepository comprobanteRepository;
    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final ComprobanteMapper comprobanteMapper;
    private final VentaMapper ventaMapper;

    @Override
    public ComprobanteResponse emitir(ComprobanteRequest request) {

        // 1. Verificar que la venta exista
        Venta venta = ventaRepository.findByIdWithDetalles(request.getVentaId())
                .orElseThrow(() -> new ResourceNotFoundException("Venta", request.getVentaId()));

        // 2. Una venta solo puede tener un comprobante
        if (comprobanteRepository.existsByVentaId(request.getVentaId())) {
            throw new BusinessException("La venta #" + request.getVentaId() + " ya tiene un comprobante emitido.");
        }

        // 3. Validar que FACTURA tenga RUC
        if (request.getTipo() == TipoComprobante.FACTURA) {
            String ruc = resolverRuc(request);
            if (ruc == null || ruc.isBlank()) {
                throw new BusinessException("Para emitir una FACTURA se requiere el RUC del cliente.");
            }
        }

        // 4. Generar correlativo
        int numero = comprobanteRepository.findMaxNumeroByTipo(request.getTipo()) + 1;
        String prefijo = request.getTipo() == TipoComprobante.BOLETA ? "BO" : "FA";
        String serie   = String.format("%s-%05d", prefijo, numero);

        // 5. Calcular IGV (precio incluye IGV)
        BigDecimal total         = venta.getTotal();
        BigDecimal baseImponible = total.divide(IGV_DIVISOR, 2, RoundingMode.HALF_UP);
        BigDecimal igv           = total.subtract(baseImponible);

        // 6. Resolver cliente
        Cliente cliente = null;
        if (request.getClienteId() != null) {
            cliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente", request.getClienteId()));
        }

        // 7. Construir comprobante con datos snapshoteados
        Comprobante comprobante = Comprobante.builder()
                .serie(serie)
                .tipo(request.getTipo())
                .numero(numero)
                .venta(venta)
                .cliente(cliente)
                // Snapshot de datos del cliente
                .clienteNombre(        resolverCampo(request.getClienteNombre(),       cliente != null ? cliente.getNombre()       : null))
                .clienteDni(           resolverCampo(request.getClienteDni(),          cliente != null ? cliente.getDni()          : null))
                .clienteRuc(           resolverCampo(request.getClienteRuc(),          cliente != null ? cliente.getRuc()          : null))
                .clienteRazonSocial(   resolverCampo(request.getClienteRazonSocial(),  cliente != null ? cliente.getRazonSocial()  : null))
                .clienteDireccion(     resolverCampo(request.getClienteDireccion(),    cliente != null ? cliente.getDireccion()    : null))
                .clienteEmail(         resolverCampo(request.getClienteEmail(),        cliente != null ? cliente.getEmail()        : null))
                // Snapshot de montos
                .subtotal(venta.getSubtotal())
                .descuento(venta.getDescuento())
                .total(total)
                .baseImponible(baseImponible)
                .igv(igv)
                .build();

        Comprobante guardado = comprobanteRepository.save(comprobante);
        return buildResponse(guardado, venta);
    }

    @Override
    @Transactional(readOnly = true)
    public ComprobanteResponse obtenerPorId(Long id) {
        Comprobante c = comprobanteRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante", id));
        return buildResponse(c, c.getVenta());
    }

    @Override
    @Transactional(readOnly = true)
    public ComprobanteResponse obtenerPorSerie(String serie) {
        Comprobante c = comprobanteRepository.findBySerie(serie)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante con serie " + serie + " no encontrado"));
        return buildResponse(c, c.getVenta());
    }

    @Override
    @Transactional(readOnly = true)
    public ComprobanteResponse obtenerPorVentaId(Long ventaId) {
        Comprobante c = comprobanteRepository.findByVentaId(ventaId)
                .orElseThrow(() -> new ResourceNotFoundException("La venta #" + ventaId + " no tiene comprobante emitido"));
        return buildResponse(c, c.getVenta());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComprobanteResponse> listarPorFecha(LocalDate inicio, LocalDate fin, TipoComprobante tipo) {
        LocalDateTime desde = inicio.atStartOfDay();
        LocalDateTime hasta = fin.atTime(LocalTime.MAX);
        List<Comprobante> lista = tipo != null
                ? comprobanteRepository.findByTipoAndRangoFecha(tipo, desde, hasta)
                : comprobanteRepository.findByRangoFecha(desde, hasta);
        return lista.stream()
                .map(c -> buildResponse(c, c.getVenta()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComprobanteResponse> listarPorCliente(Long clienteId) {
        return comprobanteRepository.findByClienteId(clienteId).stream()
                .map(c -> buildResponse(c, c.getVenta()))
                .collect(Collectors.toList());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Prioriza el valor del request; si es null usa el del cliente */
    private String resolverCampo(String fromRequest, String fromCliente) {
        return (fromRequest != null && !fromRequest.isBlank()) ? fromRequest : fromCliente;
    }

    private String resolverRuc(ComprobanteRequest request) {
        if (request.getClienteRuc() != null) return request.getClienteRuc();
        if (request.getClienteId() != null) {
            return clienteRepository.findById(request.getClienteId())
                    .map(Cliente::getRuc).orElse(null);
        }
        return null;
    }

    private ComprobanteResponse buildResponse(Comprobante c, Venta venta) {
        ComprobanteResponse res = comprobanteMapper.toResponse(c);
        if (venta != null && venta.getDetalles() != null && !venta.getDetalles().isEmpty()) {
            res.setDetalles(
                    venta.getDetalles().stream()
                            .map(ventaMapper::toDetalleResponse)
                            .collect(Collectors.toList())
            );
        }
        return res;
    }
}
