package com.pos.calzados.service;

import com.pos.calzados.dto.request.ProductoRequest;
import com.pos.calzados.dto.request.VarianteRequest;
import com.pos.calzados.dto.response.ProductoResponse;
import com.pos.calzados.dto.response.VarianteResponse;

import java.util.List;

public interface ProductoService {
    ProductoResponse crear(ProductoRequest request);
    ProductoResponse actualizar(Long id, ProductoRequest request);
    ProductoResponse obtenerPorId(Long id);
    List<ProductoResponse> listar();
    List<ProductoResponse> buscar(String nombre, Long marcaId);
    void eliminar(Long id);

    // Variantes
    VarianteResponse agregarVariante(Long productoId, VarianteRequest request);
    VarianteResponse actualizarVariante(Long productoId, Long varianteId, VarianteRequest request);
    void eliminarVariante(Long productoId, Long varianteId);
    VarianteResponse buscarPorCodigoBarras(String codigoBarras);
    List<VarianteResponse> variantesConStockBajo();
}
