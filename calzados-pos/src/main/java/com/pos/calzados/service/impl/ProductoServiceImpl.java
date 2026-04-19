package com.pos.calzados.service.impl;

import com.pos.calzados.dto.request.ProductoRequest;
import com.pos.calzados.dto.request.VarianteRequest;
import com.pos.calzados.dto.response.ProductoResponse;
import com.pos.calzados.dto.response.VarianteResponse;
import com.pos.calzados.entity.Marca;
import com.pos.calzados.entity.Producto;
import com.pos.calzados.entity.Variante;
import com.pos.calzados.exception.BusinessException;
import com.pos.calzados.exception.ResourceNotFoundException;
import com.pos.calzados.mapper.ProductoMapper;
import com.pos.calzados.mapper.VarianteMapper;
import com.pos.calzados.repository.MarcaRepository;
import com.pos.calzados.repository.ProductoRepository;
import com.pos.calzados.repository.VarianteRepository;
import com.pos.calzados.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final VarianteRepository varianteRepository;
    private final MarcaRepository marcaRepository;
    private final ProductoMapper productoMapper;
    private final VarianteMapper varianteMapper;

    @Override
    public ProductoResponse crear(ProductoRequest request) {
        Producto producto = productoMapper.toEntity(request);

        if (request.getMarcaId() != null) {
            Marca marca = marcaRepository.findById(request.getMarcaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Marca", request.getMarcaId()));
            producto.setMarca(marca);
        }

        request.getVariantes().forEach(vReq -> {
            validarUnicidadVariante(vReq, null);
            Variante variante = varianteMapper.toEntity(vReq);
            variante.setPrecioVenta(calcularPrecioVenta(vReq.getPrecioCompra(), vReq.getPorcentajeGanancia()));
            variante.setProducto(producto);
            producto.getVariantes().add(variante);
        });

        return productoMapper.toResponse(productoRepository.save(producto));
    }

    @Override
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));

        productoMapper.updateEntity(request, producto);

        if (request.getMarcaId() != null) {
            Marca marca = marcaRepository.findById(request.getMarcaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Marca", request.getMarcaId()));
            producto.setMarca(marca);
        } else {
            producto.setMarca(null);
        }

        return productoMapper.toResponse(productoRepository.save(producto));
    }



    @Override
    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Long id) {
        Producto producto = productoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        return productoMapper.toResponse(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> listar() {
        return productoMapper.toResponseList(productoRepository.findByActivoTrue());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> buscar(String nombre, Long marcaId) {
        return productoMapper.toResponseList(productoRepository.buscarProductos(nombre, marcaId));
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    // ─── Variantes ───────────────────────────────────────────────────────────────

    @Override
    public VarianteResponse agregarVariante(Long productoId, VarianteRequest request) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", productoId));

        validarUnicidadVariante(request, null);

        Variante variante = varianteMapper.toEntity(request);
        variante.setProducto(producto);
        variante.setPrecioVenta(calcularPrecioVenta(request.getPrecioCompra(), request.getPorcentajeGanancia()));

        return varianteMapper.toResponse(varianteRepository.save(variante));
    }

    @Override
    public VarianteResponse actualizarVariante(Long productoId, Long varianteId, VarianteRequest request) {
        Variante variante = varianteRepository.findById(varianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Variante", varianteId));

        if (!variante.getProducto().getId().equals(productoId)) {
            throw new BusinessException("La variante no pertenece al producto indicado");
        }

        validarUnicidadVariante(request, varianteId);

        System.out.println("ANTES: " + variante.getPrecioCompra());
        varianteMapper.updateEntity(request, variante);
        System.out.println("DESPUÉS: " + variante.getPrecioCompra());
        // Recalcular precio de venta con el nuevo porcentaje/precio compra
        variante.setPrecioVenta(calcularPrecioVenta(request.getPrecioCompra(), request.getPorcentajeGanancia()));

        return varianteMapper.toResponse(varianteRepository.save(variante));
    }



    @Override
    public void eliminarVariante(Long productoId, Long varianteId) {
        Variante variante = varianteRepository.findById(varianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Variante", varianteId));

        if (!variante.getProducto().getId().equals(productoId)) {
            throw new BusinessException("La variante no pertenece al producto indicado");
        }

        // ❌ NO BORRAR
        // varianteRepository.delete(variante);

        // ✅ SOFT DELETE
        variante.setActivo(false);
        varianteRepository.save(variante);
    }

    @Override
    @Transactional(readOnly = true)
    public VarianteResponse buscarPorCodigoBarras(String codigoBarras) {
        Variante variante = varianteRepository.findByCodigoBarras(codigoBarras)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró producto con código de barras: " + codigoBarras));
        return varianteMapper.toResponse(variante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VarianteResponse> variantesConStockBajo() {
        return varianteMapper.toResponseList(varianteRepository.findVariantesConStockBajo());
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────────

    /**
     * precio_venta = precio_compra * (1 + porcentaje_ganancia / 100)
     * El precio queda fijo en la variante; las ventas ya realizadas guardan
     * su propio precio_unitario en detalle_venta, por lo que cambios futuros
     * en la variante no afectan ventas anteriores.
     */
    private BigDecimal calcularPrecioVenta(BigDecimal precioCompra, BigDecimal porcentajeGanancia) {
        if (porcentajeGanancia == null || porcentajeGanancia.compareTo(BigDecimal.ZERO) == 0) {
            return precioCompra;
        }
        BigDecimal factor = BigDecimal.ONE.add(
                porcentajeGanancia.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP));
        return precioCompra.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }

    private void validarUnicidadVariante(VarianteRequest request, Long excludeId) {
        if (request.getSku() != null && !request.getSku().isBlank()) {
            boolean skuDuplicado = excludeId == null
                    ? varianteRepository.existsBySku(request.getSku())
                    : varianteRepository.existsBySkuAndIdNot(request.getSku(), excludeId);
            if (skuDuplicado) {
                throw new BusinessException("Ya existe una variante con el SKU: " + request.getSku());
            }
        }
        if (request.getCodigoBarras() != null && !request.getCodigoBarras().isBlank()) {
            boolean cbDuplicado = excludeId == null
                    ? varianteRepository.existsByCodigoBarras(request.getCodigoBarras())
                    : varianteRepository.existsByCodigoBarrasAndIdNot(request.getCodigoBarras(), excludeId);
            if (cbDuplicado) {
                throw new BusinessException("Ya existe una variante con el código de barras: "
                        + request.getCodigoBarras());
            }
        }
    }
}
