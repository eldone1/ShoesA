-- ============================================================
--  Calzados POS — Datos iniciales
--  Ejecutar DESPUÉS del DDL (spring.jpa.hibernate.ddl-auto=validate)
--  Contraseña de todos los usuarios de prueba: admin123 / cajero123
-- ============================================================

-- ── Usuarios ─────────────────────────────────────────────────────────────────

INSERT INTO users (nombre, email, password_hash, rol, activo) VALUES
  ('Administrador',  'admin@calzados.com',  '$2a$12$oRWX4yIVveUDDoykcsHIB.JUbcEdG.mVDgVKlA.Hat7yCVk40zaKK', 'ADMIN',  true),
  ('Juan Pérez',     'juan@calzados.com',   '$2a$10$7EqJtq98hPqEX7fNZaFWoOSogdtGkN7Gc3ItGS7Av/sNeMhBFcL6.', 'CAJERO', true),
  ('María García',   'maria@calzados.com',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOSogdtGkN7Gc3ItGS7Av/sNeMhBFcL6.', 'CAJERO', true);

-- ── Marcas ────────────────────────────────────────────────────────────────────
INSERT INTO marca (nombre, activo) VALUES
  ('Adidas',  true),
  ('Nike',    true),
  ('Puma',    true),
  ('Reebok',  true),
  ('Converse',true),
  ('Vans',    true);

-- ── Productos ─────────────────────────────────────────────────────────────────
INSERT INTO producto (marca_id, nombre, descripcion, activo) VALUES
  (1, 'Zapatilla Runner Pro',      'Zapatilla de running de alto rendimiento', true),
  (1, 'Zapatilla Ultraboost',      'Amortiguación premium para largas distancias', true),
  (2, 'Air Max 270',               'Diseño icónico con cámara de aire visible', true),
  (2, 'Revolution 6',              'Zapatilla ligera para uso diario', true),
  (3, 'Puma Velocity Nitro',       'Para corredores de velocidad', true),
  (5, 'Chuck Taylor All Star',     'El clásico de lona que nunca pasa de moda', true),
  (6, 'Vans Old Skool',            'Skate shoe clásica con franja lateral', true);

-- ── Variantes ─────────────────────────────────────────────────────────────────
-- Producto 1: Zapatilla Runner Pro (Adidas)
INSERT INTO variante (producto_id, color, talla, ubicacion, sku, codigo_barras, precio_compra, porcentaje_ganancia, precio_venta, stock, stock_minimo) VALUES
  (1, 'Rojo',  '38', 'A1', 'ADI-RUN-R-38', '7501001000001', 70.00, 50.00, 105.00, 8,  3),
  (1, 'Rojo',  '39', 'A1', 'ADI-RUN-R-39', '7501001000002', 70.00, 50.00, 105.00, 10, 3),
  (1, 'Rojo',  '40', 'A1', 'ADI-RUN-R-40', '7501001000003', 70.00, 50.00, 105.00, 12, 3),
  (1, 'Rojo',  '41', 'A2', 'ADI-RUN-R-41', '7501001000004', 70.00, 50.00, 105.00, 6,  3),
  (1, 'Rojo',  '42', 'A2', 'ADI-RUN-R-42', '7501001000005', 70.00, 50.00, 105.00, 4,  3),
  (1, 'Azul',  '39', 'A3', 'ADI-RUN-A-39', '7501001000006', 70.00, 50.00, 105.00, 8,  3),
  (1, 'Azul',  '40', 'A3', 'ADI-RUN-A-40', '7501001000007', 70.00, 50.00, 105.00, 2,  3),  -- stock bajo
  (1, 'Negro', '40', 'A4', 'ADI-RUN-N-40', '7501001000008', 70.00, 50.00, 105.00, 15, 3),
  (1, 'Negro', '41', 'A4', 'ADI-RUN-N-41', '7501001000009', 70.00, 50.00, 105.00, 1,  3);  -- stock bajo

-- Producto 2: Ultraboost (Adidas)
INSERT INTO variante (producto_id, color, talla, ubicacion, sku, codigo_barras, precio_compra, porcentaje_ganancia, precio_venta, stock, stock_minimo) VALUES
  (2, 'Blanco', '40', 'B1', 'ADI-ULT-W-40', '7501002000001', 120.00, 45.00, 174.00, 5, 2),
  (2, 'Blanco', '41', 'B1', 'ADI-ULT-W-41', '7501002000002', 120.00, 45.00, 174.00, 7, 2),
  (2, 'Blanco', '42', 'B2', 'ADI-ULT-W-42', '7501002000003', 120.00, 45.00, 174.00, 3, 2),
  (2, 'Negro',  '40', 'B2', 'ADI-ULT-N-40', '7501002000004', 120.00, 45.00, 174.00, 6, 2),
  (2, 'Negro',  '41', 'B2', 'ADI-ULT-N-41', '7501002000005', 120.00, 45.00, 174.00, 4, 2);

-- Producto 3: Air Max 270 (Nike)
INSERT INTO variante (producto_id, color, talla, ubicacion, sku, codigo_barras, precio_compra, porcentaje_ganancia, precio_venta, stock, stock_minimo) VALUES
  (3, 'Negro/Blanco', '39', 'C1', 'NIK-AM270-NB-39', '7501003000001', 100.00, 55.00, 155.00, 8, 3),
  (3, 'Negro/Blanco', '40', 'C1', 'NIK-AM270-NB-40', '7501003000002', 100.00, 55.00, 155.00, 10, 3),
  (3, 'Negro/Blanco', '41', 'C1', 'NIK-AM270-NB-41', '7501003000003', 100.00, 55.00, 155.00, 6, 3),
  (3, 'Rojo/Negro',   '40', 'C2', 'NIK-AM270-RN-40', '7501003000004', 100.00, 55.00, 155.00, 4, 3),
  (3, 'Rojo/Negro',   '41', 'C2', 'NIK-AM270-RN-41', '7501003000005', 100.00, 55.00, 155.00, 0, 3);  -- sin stock

-- Producto 4: Revolution 6 (Nike)
INSERT INTO variante (producto_id, color, talla, ubicacion, sku, codigo_barras, precio_compra, porcentaje_ganancia, precio_venta, stock, stock_minimo) VALUES
  (4, 'Gris',  '38', 'D1', 'NIK-REV6-G-38', '7501004000001', 55.00, 45.00,  79.75, 12, 4),
  (4, 'Gris',  '39', 'D1', 'NIK-REV6-G-39', '7501004000002', 55.00, 45.00,  79.75, 10, 4),
  (4, 'Gris',  '40', 'D1', 'NIK-REV6-G-40', '7501004000003', 55.00, 45.00,  79.75, 8,  4),
  (4, 'Azul',  '39', 'D2', 'NIK-REV6-A-39', '7501004000004', 55.00, 45.00,  79.75, 6,  4),
  (4, 'Azul',  '40', 'D2', 'NIK-REV6-A-40', '7501004000005', 55.00, 45.00,  79.75, 5,  4);

-- Producto 5: Puma Velocity Nitro
INSERT INTO variante (producto_id, color, talla, ubicacion, sku, codigo_barras, precio_compra, porcentaje_ganancia, precio_venta, stock, stock_minimo) VALUES
  (5, 'Naranja', '39', 'E1', 'PUM-VN-O-39', '7501005000001', 80.00, 50.00, 120.00, 7, 3),
  (5, 'Naranja', '40', 'E1', 'PUM-VN-O-40', '7501005000002', 80.00, 50.00, 120.00, 5, 3),
  (5, 'Naranja', '41', 'E1', 'PUM-VN-O-41', '7501005000003', 80.00, 50.00, 120.00, 3, 3),
  (5, 'Negro',   '40', 'E2', 'PUM-VN-N-40', '7501005000004', 80.00, 50.00, 120.00, 9, 3),
  (5, 'Negro',   '41', 'E2', 'PUM-VN-N-41', '7501005000005', 80.00, 50.00, 120.00, 2, 3);  -- stock bajo

-- Producto 6: Chuck Taylor (Converse)
INSERT INTO variante (producto_id, color, talla, ubicacion, sku, codigo_barras, precio_compra, porcentaje_ganancia, precio_venta, stock, stock_minimo) VALUES
  (6, 'Negro', '36', 'F1', 'CON-CT-N-36', '7501006000001', 40.00, 60.00, 64.00, 10, 4),
  (6, 'Negro', '37', 'F1', 'CON-CT-N-37', '7501006000002', 40.00, 60.00, 64.00, 12, 4),
  (6, 'Negro', '38', 'F1', 'CON-CT-N-38', '7501006000003', 40.00, 60.00, 64.00, 8,  4),
  (6, 'Blanco','36', 'F2', 'CON-CT-W-36', '7501006000004', 40.00, 60.00, 64.00, 6,  4),
  (6, 'Blanco','37', 'F2', 'CON-CT-W-37', '7501006000005', 40.00, 60.00, 64.00, 4,  4),
  (6, 'Rojo',  '37', 'F2', 'CON-CT-R-37', '7501006000006', 40.00, 60.00, 64.00, 1,  4);  -- stock bajo

-- Producto 7: Vans Old Skool
INSERT INTO variante (producto_id, color, talla, ubicacion, sku, codigo_barras, precio_compra, porcentaje_ganancia, precio_venta, stock, stock_minimo) VALUES
  (7, 'Negro/Blanco', '38', 'G1', 'VAN-OS-NB-38', '7501007000001', 45.00, 55.00, 69.75, 8,  3),
  (7, 'Negro/Blanco', '39', 'G1', 'VAN-OS-NB-39', '7501007000002', 45.00, 55.00, 69.75, 10, 3),
  (7, 'Negro/Blanco', '40', 'G1', 'VAN-OS-NB-40', '7501007000003', 45.00, 55.00, 69.75, 6,  3),
  (7, 'Azul/Blanco',  '39', 'G2', 'VAN-OS-AB-39', '7501007000004', 45.00, 55.00, 69.75, 5,  3),
  (7, 'Azul/Blanco',  '40', 'G2', 'VAN-OS-AB-40', '7501007000005', 45.00, 55.00, 69.75, 3,  3);

-- ── Clientes de prueba ────────────────────────────────────────────────────────
INSERT INTO clientes (nombre, dni, ruc, razon_social, numero_telefono, email, direccion, activo) VALUES
  ('Carlos Ramírez',    '12345678', NULL,          NULL,                        '987654321', 'carlos@email.com',  'Av. Lima 123, Lima',       true),
  ('Ana Torres',        '23456789', NULL,          NULL,                        '976543210', 'ana@email.com',     'Jr. Cusco 456, Lima',       true),
  ('Pedro Mendoza',     '34567890', NULL,          NULL,                        '965432109', 'pedro@email.com',   'Calle Arequipa 789, Lima',  true),
  ('Inversiones SAC',   '45678901', '20123456789', 'Inversiones Calzado SAC',   '954321098', 'inv@empresa.com',   'Av. Industrial 100, Lima',  true),
  ('Distribuidora XYZ', '56789012', '20987654321', 'Distribuidora XYZ EIRL',    '943210987', 'xyz@empresa.com',   'Av. Comercial 200, Lima',   true);

-- ── Proveedores de prueba ───────────────────────────────────────────────────
INSERT INTO proveedor (nombre, ruc, contacto, numero_telefono, email, direccion, dias_credito, activo) VALUES
  ('Importadora Andina SAC',    '20600000001', 'Luis Paredes',    '987111222', 'ventas@andina.com',    'Av. Javier Prado 1200, Lima', 30, true),
  ('Distribuciones Norte EIRL', '20600000002', 'Rosa Huamán',     '987333444', 'contacto@norte.pe',    'Jr. Libertad 450, Trujillo',  15, true),
  ('Proveedor Global Shoes',    '20600000003', 'Carlos Tello',    '987555666', 'compras@globalshoes.pe','Calle Comercio 890, Arequipa', 45, true);

-- ── Solicitudes de compra de prueba ─────────────────────────────────────────
INSERT INTO solicitud_compra (codigo, proveedor_id, usuario_id, condicion_pago, fecha_vencimiento, total, pagado, estado, observacion, activo)
VALUES
  ('SC-SEED-0001', 1, 1, 'CREDITO', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1275.00, false, 'PENDIENTE_RECEPCION', 'Solicitud inicial de reposición', true);

INSERT INTO detalle_solicitud_compra (solicitud_compra_id, producto_id, variante_id, cantidad_solicitada, cantidad_recibida, precio_unitario, subtotal)
VALUES
  (1, 1, 1, 10, 0, 70.00, 700.00),
  (1, 3, 15, 5,  0, 100.00, 500.00),
  (1, 6, 30, 1,  0, 75.00, 75.00);

-- ── Gastos de operación de ejemplo ──────────────────────────────────────────
INSERT INTO gasto (tipo, concepto, monto, fecha_gasto, descripcion, usuario_id)
VALUES
  ('LUZ', 'Recibo de energía eléctrica', 450.00, CURDATE(), 'Consumo del local principal', 1),
  ('INTERNET', 'Servicio de internet', 169.90, CURDATE(), 'Plan fibra óptica mensual', 1),
  ('CREDITO_PROVEEDOR', 'Pago parcial proveedor Importadora Andina SAC', 800.00, CURDATE(), 'Abono de crédito a 30 días', 1);

-- ── Historial de ventas (meses pasados) + comprobantes ─────────────────────
-- Nota: Este bloque genera data histórica para reportes generales, productos,
-- inventario/rotación y finanzas por cajero/método de pago.

SET @admin_id = (SELECT id FROM users WHERE email = 'admin@calzados.com' LIMIT 1);
SET @juan_id = (SELECT id FROM users WHERE email = 'juan@calzados.com' LIMIT 1);
SET @maria_id = (SELECT id FROM users WHERE email = 'maria@calzados.com' LIMIT 1);

SET @cliente_carlos = (SELECT id FROM clientes WHERE dni = '12345678' LIMIT 1);
SET @cliente_ana = (SELECT id FROM clientes WHERE dni = '23456789' LIMIT 1);
SET @cliente_pedro = (SELECT id FROM clientes WHERE dni = '34567890' LIMIT 1);
SET @cliente_inv = (SELECT id FROM clientes WHERE ruc = '20123456789' LIMIT 1);
SET @cliente_xyz = (SELECT id FROM clientes WHERE ruc = '20987654321' LIMIT 1);

-- Cajas históricas (cerradas)
INSERT INTO cajas (
  cajero_id, apertura, cierre, monto_inicial,
  total_efectivo, total_yape, total_tarjeta,
  monto_final_esperado, monto_final_real, diferencia,
  estado
) VALUES
  (@juan_id,  '2025-11-15 08:00:00', '2025-11-15 20:00:00', 300.00, 200.00,   0.00,   0.00, 500.00, 500.00, 0.00, 'CERRADA'),
  (@maria_id, '2025-11-22 08:10:00', '2025-11-22 19:40:00', 280.00,   0.00, 174.00,   0.00, 454.00, 454.00, 0.00, 'CERRADA'),
  (@juan_id,  '2025-12-10 08:00:00', '2025-12-10 20:10:00', 320.00,   0.00,   0.00, 310.00, 630.00, 630.00, 0.00, 'CERRADA'),
  (@maria_id, '2026-01-18 08:20:00', '2026-01-18 19:20:00', 300.00, 230.00,   0.00,   0.00, 530.00, 530.00, 0.00, 'CERRADA'),
  (@juan_id,  '2026-02-12 08:00:00', '2026-02-12 20:00:00', 350.00,   0.00, 240.00,   0.00, 590.00, 590.00, 0.00, 'CERRADA'),
  (@maria_id, '2026-03-08 08:15:00', '2026-03-08 19:30:00', 300.00, 200.00,   0.00,   0.00, 500.00, 500.00, 0.00, 'CERRADA'),
  (@juan_id,  '2026-04-05 08:00:00', '2026-04-05 20:00:00', 300.00,   0.00,   0.00, 340.00, 640.00, 640.00, 0.00, 'CERRADA'),
  (@maria_id, '2026-04-20 08:10:00', '2026-04-20 19:40:00', 280.00, 210.00,   0.00,   0.00, 490.00, 490.00, 0.00, 'CERRADA');

-- Resolver IDs de cajas recién creadas por timestamp
SET @caja_nov_juan = (SELECT id FROM cajas WHERE cajero_id = @juan_id  AND apertura = '2025-11-15 08:00:00' LIMIT 1);
SET @caja_nov_maria = (SELECT id FROM cajas WHERE cajero_id = @maria_id AND apertura = '2025-11-22 08:10:00' LIMIT 1);
SET @caja_dic_juan = (SELECT id FROM cajas WHERE cajero_id = @juan_id  AND apertura = '2025-12-10 08:00:00' LIMIT 1);
SET @caja_ene_maria = (SELECT id FROM cajas WHERE cajero_id = @maria_id AND apertura = '2026-01-18 08:20:00' LIMIT 1);
SET @caja_feb_juan = (SELECT id FROM cajas WHERE cajero_id = @juan_id  AND apertura = '2026-02-12 08:00:00' LIMIT 1);
SET @caja_mar_maria = (SELECT id FROM cajas WHERE cajero_id = @maria_id AND apertura = '2026-03-08 08:15:00' LIMIT 1);
SET @caja_abr_juan = (SELECT id FROM cajas WHERE cajero_id = @juan_id  AND apertura = '2026-04-05 08:00:00' LIMIT 1);
SET @caja_abr_maria = (SELECT id FROM cajas WHERE cajero_id = @maria_id AND apertura = '2026-04-20 08:10:00' LIMIT 1);

-- Ventas históricas
INSERT INTO ventas (
  caja_id, cajero_id, fecha, subtotal, descuento, total,
  metodo_pago, monto_recibido, vuelto, notas
) VALUES
  (@caja_nov_juan,  @juan_id,  '2025-11-15 10:25:00', 210.00, 10.00, 200.00, 'EFECTIVO', 220.00, 20.00, 'Venta campaña noviembre'),
  (@caja_nov_maria, @maria_id, '2025-11-22 12:40:00', 174.00,  0.00, 174.00, 'YAPE',      NULL,  0.00, 'Venta por Yape'),
  (@caja_dic_juan,  @juan_id,  '2025-12-10 18:15:00', 310.00,  0.00, 310.00, 'TARJETA',   NULL,  0.00, 'Venta navideña'),
  (@caja_ene_maria, @maria_id, '2026-01-18 11:05:00', 239.25,  9.25, 230.00, 'EFECTIVO', 250.00, 20.00, 'Promoción verano'),
  (@caja_feb_juan,  @juan_id,  '2026-02-12 16:30:00', 240.00,  0.00, 240.00, 'YAPE',      NULL,  0.00, 'Venta quincena'),
  (@caja_mar_maria, @maria_id, '2026-03-08 14:50:00', 203.50,  3.50, 200.00, 'EFECTIVO', 210.00, 10.00, 'Cliente recurrente'),
  (@caja_abr_juan,  @juan_id,  '2026-04-05 17:20:00', 348.00,  8.00, 340.00, 'TARJETA',   NULL,  0.00, 'Venta fin de semana'),
  (@caja_abr_maria, @maria_id, '2026-04-20 09:40:00', 210.00,  0.00, 210.00, 'EFECTIVO', 220.00, 10.00, 'Venta apertura de día');

-- Resolver IDs de ventas recién creadas
SET @v_nov_juan = (SELECT id FROM ventas WHERE caja_id = @caja_nov_juan  AND fecha = '2025-11-15 10:25:00' LIMIT 1);
SET @v_nov_maria = (SELECT id FROM ventas WHERE caja_id = @caja_nov_maria AND fecha = '2025-11-22 12:40:00' LIMIT 1);
SET @v_dic_juan = (SELECT id FROM ventas WHERE caja_id = @caja_dic_juan  AND fecha = '2025-12-10 18:15:00' LIMIT 1);
SET @v_ene_maria = (SELECT id FROM ventas WHERE caja_id = @caja_ene_maria AND fecha = '2026-01-18 11:05:00' LIMIT 1);
SET @v_feb_juan = (SELECT id FROM ventas WHERE caja_id = @caja_feb_juan  AND fecha = '2026-02-12 16:30:00' LIMIT 1);
SET @v_mar_maria = (SELECT id FROM ventas WHERE caja_id = @caja_mar_maria AND fecha = '2026-03-08 14:50:00' LIMIT 1);
SET @v_abr_juan = (SELECT id FROM ventas WHERE caja_id = @caja_abr_juan  AND fecha = '2026-04-05 17:20:00' LIMIT 1);
SET @v_abr_maria = (SELECT id FROM ventas WHERE caja_id = @caja_abr_maria AND fecha = '2026-04-20 09:40:00' LIMIT 1);

-- Detalle de ventas históricas (incluye costo_unitario para utilidad real)
INSERT INTO detalle_venta (
  venta_id, variante_id, cantidad, precio_unitario, costo_unitario, descuento_item, subtotal
) VALUES
  (@v_nov_juan,   1, 2, 105.00, 70.00, 10.00, 200.00),
  (@v_nov_maria, 10, 1, 174.00, 120.00, 0.00, 174.00),
  (@v_dic_juan,  16, 2, 155.00, 100.00, 0.00, 310.00),
  (@v_ene_maria, 21, 3, 79.75, 55.00, 9.25, 230.00),
  (@v_feb_juan,  26, 2, 120.00, 80.00, 0.00, 240.00),
  (@v_mar_maria, 35, 2, 69.75, 45.00, 0.00, 139.50),
  (@v_mar_maria, 31, 1, 64.00, 40.00, 3.50, 60.50),
  (@v_abr_juan,  10, 2, 174.00, 120.00, 8.00, 340.00),
  (@v_abr_maria,  1, 2, 105.00, 70.00, 0.00, 210.00);

-- Comprobantes históricos vinculados a ventas
INSERT INTO comprobantes (
  serie, tipo, numero, venta_id, cliente_id,
  cliente_nombre, cliente_dni, cliente_ruc, cliente_razon_social, cliente_direccion, cliente_email,
  subtotal, descuento, total, igv, base_imponible, fecha_emision
) VALUES
  ('B001-000101', 'BOLETA', 101, @v_nov_juan,  @cliente_carlos,
   'Carlos Ramírez', '12345678', NULL, NULL, 'Av. Lima 123, Lima', 'carlos@email.com',
   210.00, 10.00, 200.00, 30.51, 169.49, '2025-11-15 10:30:00'),

  ('B001-000102', 'BOLETA', 102, @v_nov_maria, @cliente_ana,
   'Ana Torres', '23456789', NULL, NULL, 'Jr. Cusco 456, Lima', 'ana@email.com',
   174.00, 0.00, 174.00, 26.54, 147.46, '2025-11-22 12:45:00'),

  ('F001-000051', 'FACTURA', 51, @v_dic_juan, @cliente_inv,
   'Inversiones SAC', NULL, '20123456789', 'Inversiones Calzado SAC', 'Av. Industrial 100, Lima', 'inv@empresa.com',
   310.00, 0.00, 310.00, 47.29, 262.71, '2025-12-10 18:20:00'),

  ('B001-000103', 'BOLETA', 103, @v_ene_maria, @cliente_pedro,
   'Pedro Mendoza', '34567890', NULL, NULL, 'Calle Arequipa 789, Lima', 'pedro@email.com',
   239.25, 9.25, 230.00, 35.08, 194.92, '2026-01-18 11:10:00'),

  ('B001-000104', 'BOLETA', 104, @v_feb_juan, @cliente_ana,
   'Ana Torres', '23456789', NULL, NULL, 'Jr. Cusco 456, Lima', 'ana@email.com',
   240.00, 0.00, 240.00, 36.61, 203.39, '2026-02-12 16:35:00'),

  ('F001-000052', 'FACTURA', 52, @v_mar_maria, @cliente_xyz,
   'Distribuidora XYZ', NULL, '20987654321', 'Distribuidora XYZ EIRL', 'Av. Comercial 200, Lima', 'xyz@empresa.com',
   203.50, 3.50, 200.00, 30.51, 169.49, '2026-03-08 14:55:00'),

  ('F001-000053', 'FACTURA', 53, @v_abr_juan, @cliente_inv,
   'Inversiones SAC', NULL, '20123456789', 'Inversiones Calzado SAC', 'Av. Industrial 100, Lima', 'inv@empresa.com',
   348.00, 8.00, 340.00, 51.86, 288.14, '2026-04-05 17:25:00'),

  ('B001-000105', 'BOLETA', 105, @v_abr_maria, @cliente_carlos,
   'Carlos Ramírez', '12345678', NULL, NULL, 'Av. Lima 123, Lima', 'carlos@email.com',
   210.00, 0.00, 210.00, 32.03, 177.97, '2026-04-20 09:45:00');
