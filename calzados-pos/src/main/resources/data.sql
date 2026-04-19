-- ============================================================
--  Calzados POS — Datos iniciales
--  Ejecutar DESPUÉS del DDL (spring.jpa.hibernate.ddl-auto=validate)
--  Contraseña de todos los usuarios de prueba: admin123 / cajero123
-- ============================================================

-- ── Usuarios ─────────────────────────────────────────────────────────────────
-- Passwords hasheados con BCrypt (rounds=10)
-- admin123  → $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi
-- cajero123 → $2a$10$7EqJtq98hPqEX7fNZaFWoOSogdtGkN7Gc3ItGS7Av/sNeMhBFcL6

INSERT INTO users (nombre, email, password_hash, rol, activo) VALUES
  ('Administrador',  'admin@calzados.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN',  true),
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
