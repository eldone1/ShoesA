package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.GastoRequest;
import com.pos.calzados.dto.response.GastoResponse;
import com.pos.calzados.dto.response.PageResponse;
import com.pos.calzados.dto.response.ResumenGastosMesResponse;
import com.pos.calzados.entity.Gasto;
import com.pos.calzados.entity.User;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.repository.GastoRepository;
import com.pos.calzados.repository.UserRepository;
import com.pos.calzados.repository.VentaRepository;
import com.pos.calzados.service.GastoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GastoServiceImpl implements GastoService {

    private final GastoRepository gastoRepository;
    private final UserRepository userRepository;
    private final VentaRepository ventaRepository;

    @Override
    public GastoResponse crear(GastoRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", userId));

        Gasto gasto = Gasto.builder()
                .tipo(request.getTipo())
                .concepto(request.getConcepto().trim())
                .monto(request.getMonto())
                .fechaGasto(request.getFechaGasto())
                .descripcion(request.getDescripcion())
                .usuario(user)
                .build();

        return toResponse(gastoRepository.save(gasto));
    }

    @Override
    @Transactional(readOnly = true)
    public List<GastoResponse> listarMes(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate desde = ym.atDay(1);
        LocalDate hasta = ym.atEndOfMonth();

        return gastoRepository.findByFechaGastoBetweenOrderByFechaGastoDescCreatedAtDesc(desde, hasta)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<GastoResponse> listarMesPaginado(int year, int month, int page, int size) {
        List<GastoResponse> all = listarMes(year, month);
        int total = all.size();
        int from = page * size;
        int to = Math.min(from + size, total);
        List<GastoResponse> content = from < total ? all.subList(from, to) : List.of();
        int totalPages = (int) Math.ceil((double) total / size);
        return new PageResponse<>(content, total, totalPages, page, size);
    }

    @Override
    @Transactional(readOnly = true)
    public ResumenGastosMesResponse resumenMes(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate desde = ym.atDay(1);
        LocalDate hasta = ym.atEndOfMonth();

        LocalDateTime inicioVentas = desde.atStartOfDay();
        LocalDateTime finVentas = hasta.atTime(LocalTime.MAX);

        BigDecimal totalVentasMes = ventaRepository.sumTotalByRangoFecha(inicioVentas, finVentas);
        BigDecimal totalGastosMes = gastoRepository.sumMontoByFechaGastoBetween(desde, hasta);
        BigDecimal saldoMes = totalVentasMes.subtract(totalGastosMes);

        return ResumenGastosMesResponse.builder()
                .year(year)
                .month(month)
                .totalVentasMes(totalVentasMes)
                .totalGastosMes(totalGastosMes)
                .saldoMes(saldoMes)
                .build();
    }

    @Override
    public GastoResponse actualizar(Long id, GastoRequest request) {
        Gasto gasto = gastoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gasto", id));

        gasto.setTipo(request.getTipo());
        gasto.setConcepto(request.getConcepto().trim());
        gasto.setMonto(request.getMonto());
        gasto.setFechaGasto(request.getFechaGasto());
        gasto.setDescripcion(request.getDescripcion());

        return toResponse(gastoRepository.save(gasto));
    }

    @Override
    public void eliminar(Long id) {
        if (!gastoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Gasto", id);
        }
        gastoRepository.deleteById(id);
    }

    private GastoResponse toResponse(Gasto g) {
        return GastoResponse.builder()
                .id(g.getId())
                .tipo(g.getTipo())
                .concepto(g.getConcepto())
                .monto(g.getMonto())
                .fechaGasto(g.getFechaGasto())
                .descripcion(g.getDescripcion())
                .usuarioId(g.getUsuario().getId())
                .usuarioNombre(g.getUsuario().getNombre())
                .createdAt(g.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public GastoResponse obtenerPorId(Long id) {
        return toResponse(gastoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gasto", id)));
    }
}
