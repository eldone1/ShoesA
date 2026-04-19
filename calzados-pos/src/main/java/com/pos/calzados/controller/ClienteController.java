package com.pos.calzados.controller;

import com.pos.calzados.dto.request.ClienteRequest;
import com.pos.calzados.dto.response.ApiResponse;
import com.pos.calzados.dto.response.ClienteResponse;
import com.pos.calzados.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    /** GET /api/clientes?q=juan  — busca por nombre, DNI, RUC o email */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClienteResponse>>> listar(
            @RequestParam(required = false) String q) {
        List<ClienteResponse> data = (q != null && !q.isBlank())
                ? clienteService.buscar(q)
                : clienteService.listar();
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    /** GET /api/clientes/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteResponse>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(clienteService.obtenerPorId(id)));
    }

    /** GET /api/clientes/dni/{dni}  — útil para autocompletar en el POS */
    @GetMapping("/dni/{dni}")
    public ResponseEntity<ApiResponse<ClienteResponse>> obtenerPorDni(@PathVariable String dni) {
        return ResponseEntity.ok(ApiResponse.ok(clienteService.obtenerPorDni(dni)));
    }

    /** POST /api/clientes */
    @PostMapping
    public ResponseEntity<ApiResponse<ClienteResponse>> crear(@Valid @RequestBody ClienteRequest request) {
        ClienteResponse response = clienteService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Cliente creado exitosamente", response));
    }

    /** PUT /api/clientes/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Cliente actualizado", clienteService.actualizar(id, request)));
    }

    /** PATCH /api/clientes/{id}/estado?activo=false */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<Void>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam boolean activo) {
        clienteService.cambiarEstado(id, activo);
        return ResponseEntity.ok(ApiResponse.ok(activo ? "Cliente activado" : "Cliente desactivado", null));
    }
}
