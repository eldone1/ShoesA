package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.DetalleSolicitudCompraRequest;
import com.pos.calzados.dto.request.RecepcionDetalleRequest;
import com.pos.calzados.dto.request.RecepcionMercaderiaRequest;
import com.pos.calzados.dto.request.SolicitudCompraRequest;
import com.pos.calzados.dto.response.DetalleSolicitudCompraResponse;
import com.pos.calzados.dto.response.ProveedorResponse;
import com.pos.calzados.dto.response.SolicitudCompraResponse;
import com.pos.calzados.entity.*;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.repository.ProductoRepository;
import com.pos.calzados.repository.ProveedorRepository;
import com.pos.calzados.repository.SolicitudCompraRepository;
import com.pos.calzados.repository.UserRepository;
import com.pos.calzados.repository.VarianteRepository;
import com.pos.calzados.repository.GastoRepository;
import com.pos.calzados.service.SolicitudCompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SolicitudCompraServiceImpl implements SolicitudCompraService {

    private final SolicitudCompraRepository solicitudCompraRepository;
    private final ProveedorRepository proveedorRepository;
    private final UserRepository userRepository;
    private final ProductoRepository productoRepository;
    private final VarianteRepository varianteRepository;
        private final GastoRepository gastoRepository;

    @Override
    public SolicitudCompraResponse crear(SolicitudCompraRequest request, Long userId) {
        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", request.getProveedorId()));

        if (!Boolean.TRUE.equals(proveedor.getActivo())) {
            throw new BusinessException("No se puede crear solicitud para un proveedor inactivo");
        }

        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", userId));

        if (request.getCondicionPago() == CondicionPagoCompra.CREDITO
                && request.getFechaVencimiento() == null) {
            request.setFechaVencimiento(LocalDate.now().plusDays(proveedor.getDiasCredito()));
        }

        if (request.getCondicionPago() == CondicionPagoCompra.CREDITO
                && request.getFechaVencimiento().isBefore(LocalDate.now())) {
            throw new BusinessException("La fecha de vencimiento no puede ser anterior a hoy");
        }

        SolicitudCompra solicitud = SolicitudCompra.builder()
                .codigo(generarCodigo())
                .proveedor(proveedor)
                .usuario(usuario)
                .condicionPago(request.getCondicionPago())
                .fechaVencimiento(request.getCondicionPago() == CondicionPagoCompra.CREDITO
                        ? request.getFechaVencimiento()
                        : null)
                .pagado(request.getCondicionPago() == CondicionPagoCompra.CONTADO)
                .estado(EstadoSolicitudCompra.PENDIENTE_RECEPCION)
                .observacion(request.getObservacion())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        List<DetalleSolicitudCompra> detalles = new ArrayList<>();

        for (DetalleSolicitudCompraRequest dReq : request.getDetalles()) {
            Producto producto = productoRepository.findById(dReq.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", dReq.getProductoId()));

            Variante variante = varianteRepository.findById(dReq.getVarianteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variante", dReq.getVarianteId()));

            if (!variante.getProducto().getId().equals(producto.getId())) {
                throw new BusinessException("La variante " + dReq.getVarianteId() +
                        " no pertenece al producto " + dReq.getProductoId());
            }

            BigDecimal subtotal = dReq.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(dReq.getCantidadSolicitada()));

            DetalleSolicitudCompra detalle = DetalleSolicitudCompra.builder()
                    .solicitudCompra(solicitud)
                    .producto(producto)
                    .variante(variante)
                    .cantidadSolicitada(dReq.getCantidadSolicitada())
                    .cantidadRecibida(0)
                    .precioUnitario(dReq.getPrecioUnitario())
                    .subtotal(subtotal)
                    .build();

            detalles.add(detalle);
            total = total.add(subtotal);
        }

        solicitud.setDetalles(detalles);
        solicitud.setTotal(total);

        SolicitudCompra saved = solicitudCompraRepository.save(solicitud);
                registrarGastoCreditoProveedor(saved);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SolicitudCompraResponse obtenerPorId(Long id) {
        SolicitudCompra solicitud = solicitudCompraRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new ResourceNotFoundException("SolicitudCompra", id));
        return toResponse(solicitud);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitudCompraResponse> listar(Long proveedorId, EstadoSolicitudCompra estado,
                                                Boolean pagado, LocalDate desde, LocalDate hasta) {
        LocalDateTime fechaDesde = desde != null ? desde.atStartOfDay() : null;
        LocalDateTime fechaHasta = hasta != null ? hasta.atTime(LocalTime.MAX) : null;

        return solicitudCompraRepository.filtrar(proveedorId, estado, pagado, fechaDesde, fechaHasta)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public SolicitudCompraResponse recepcionar(Long id, RecepcionMercaderiaRequest request) {
        SolicitudCompra solicitud = solicitudCompraRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new ResourceNotFoundException("SolicitudCompra", id));

        if (solicitud.getEstado() == EstadoSolicitudCompra.ANULADA) {
            throw new BusinessException("No puedes recepcionar una solicitud anulada");
        }

        Map<Long, DetalleSolicitudCompra> detallesMap = solicitud.getDetalles()
                .stream()
                .collect(Collectors.toMap(DetalleSolicitudCompra::getId, Function.identity()));

        for (RecepcionDetalleRequest recepcion : request.getDetalles()) {
            DetalleSolicitudCompra detalle = detallesMap.get(recepcion.getDetalleId());
            if (detalle == null) {
                throw new BusinessException("El detalle " + recepcion.getDetalleId() +
                        " no pertenece a la solicitud " + id);
            }

                        if (recepcion.getCantidadRecibida() <= 0) {
                                throw new BusinessException("La cantidad recibida debe ser mayor a cero");
                        }

            int restante = detalle.getCantidadSolicitada() - detalle.getCantidadRecibida();
            if (recepcion.getCantidadRecibida() > restante) {
                throw new BusinessException("Cantidad recibida inválida para " + detalle.getVariante().getSku() +
                        ". Máximo permitido: " + restante);
            }

                        // Aplicar ingreso de stock y actualizar costos vigentes de la variante
            Variante variante = detalle.getVariante();
                        BigDecimal nuevoPrecioCompra = detalle.getPrecioUnitario();
                        variante.setPrecioCompra(nuevoPrecioCompra);
                        variante.setPrecioVenta(calcularPrecioVenta(nuevoPrecioCompra, variante.getPorcentajeGanancia()));
            variante.setStock(variante.getStock() + recepcion.getCantidadRecibida());
            varianteRepository.save(variante);

            detalle.setCantidadRecibida(detalle.getCantidadRecibida() + recepcion.getCantidadRecibida());
        }

        actualizarEstadoPorRecepcion(solicitud);
        SolicitudCompra saved = solicitudCompraRepository.save(solicitud);
        return toResponse(saved);
    }

    @Override
    public SolicitudCompraResponse marcarPagado(Long id, boolean pagado) {
        SolicitudCompra solicitud = solicitudCompraRepository.findByIdWithDetalles(id)
                .orElseThrow(() -> new ResourceNotFoundException("SolicitudCompra", id));

        if (solicitud.getEstado() == EstadoSolicitudCompra.ANULADA) {
            throw new BusinessException("No puedes cambiar pago de una solicitud anulada");
        }

        solicitud.setPagado(pagado);
        return toResponse(solicitudCompraRepository.save(solicitud));
    }

    private void actualizarEstadoPorRecepcion(SolicitudCompra solicitud) {
        int totalSolicitado = solicitud.getDetalles().stream()
                .mapToInt(DetalleSolicitudCompra::getCantidadSolicitada)
                .sum();
        int totalRecibido = solicitud.getDetalles().stream()
                .mapToInt(DetalleSolicitudCompra::getCantidadRecibida)
                .sum();

        if (totalRecibido <= 0) {
            solicitud.setEstado(EstadoSolicitudCompra.PENDIENTE_RECEPCION);
        } else if (totalRecibido < totalSolicitado) {
            solicitud.setEstado(EstadoSolicitudCompra.PARCIAL_RECEPCION);
        } else {
            solicitud.setEstado(EstadoSolicitudCompra.RECEPCIONADA);
        }
    }

    private String generarCodigo() {
        String stamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "SC-" + stamp;
    }

        private void registrarGastoCreditoProveedor(SolicitudCompra solicitud) {
                Gasto gasto = Gasto.builder()
                                .tipo(TipoGasto.CREDITO_PROVEEDOR)
                                .concepto("Solicitud de compra " + solicitud.getCodigo() + " - " + solicitud.getProveedor().getNombre())
                                .monto(solicitud.getTotal())
                                .fechaGasto(solicitud.getFechaSolicitud().toLocalDate())
                                .descripcion("Registro automático desde solicitud de compra")
                                .usuario(solicitud.getUsuario())
                                .build();

                gastoRepository.save(gasto);
        }

        private BigDecimal calcularPrecioVenta(BigDecimal precioCompra, BigDecimal porcentajeGanancia) {
                if (porcentajeGanancia == null || porcentajeGanancia.compareTo(BigDecimal.ZERO) == 0) {
                        return precioCompra;
                }
                BigDecimal factor = BigDecimal.ONE.add(
                                porcentajeGanancia.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP));
                return precioCompra.multiply(factor).setScale(2, RoundingMode.HALF_UP);
        }

    private SolicitudCompraResponse toResponse(SolicitudCompra s) {
        List<DetalleSolicitudCompraResponse> detalles = s.getDetalles().stream()
                .map(d -> DetalleSolicitudCompraResponse.builder()
                        .id(d.getId())
                        .productoId(d.getProducto().getId())
                        .productoNombre(d.getProducto().getNombre())
                        .varianteId(d.getVariante().getId())
                        .varianteSku(d.getVariante().getSku())
                        .varianteColor(d.getVariante().getColor())
                        .varianteTalla(d.getVariante().getTalla())
                        .cantidadSolicitada(d.getCantidadSolicitada())
                        .cantidadRecibida(d.getCantidadRecibida())
                        .cantidadPendiente(d.getCantidadSolicitada() - d.getCantidadRecibida())
                        .precioUnitario(d.getPrecioUnitario())
                        .subtotal(d.getSubtotal())
                        .build())
                .toList();

        Proveedor p = s.getProveedor();
        ProveedorResponse proveedor = ProveedorResponse.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .ruc(p.getRuc())
                .contacto(p.getContacto())
                .numeroTelefono(p.getNumeroTelefono())
                .email(p.getEmail())
                .direccion(p.getDireccion())
                .diasCredito(p.getDiasCredito())
                .activo(p.getActivo())
                .createdAt(p.getCreatedAt())
                .build();

        return SolicitudCompraResponse.builder()
                .id(s.getId())
                .codigo(s.getCodigo())
                .proveedor(proveedor)
                .usuarioId(s.getUsuario().getId())
                .usuarioNombre(s.getUsuario().getNombre())
                .condicionPago(s.getCondicionPago())
                .fechaVencimiento(s.getFechaVencimiento())
                .fechaSolicitud(s.getFechaSolicitud())
                .total(s.getTotal())
                .pagado(s.getPagado())
                .estado(s.getEstado())
                .observacion(s.getObservacion())
                .detalles(detalles)
                .build();
    }
}
