-- ============================================================
--  Calzados POS — DDL completo
--  Motor: MySQL 8+
--  Ejecutar en orden. Spring Boot validará contra este schema.
-- ============================================================

CREATE DATABASE IF NOT EXISTS calzados_pos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE calzados_pos;

-- 1. Usuarios
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  UNIQUE NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    rol           VARCHAR(20)   NOT NULL,          -- ADMIN | CAJERO
    activo        BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rol CHECK (rol IN ('ADMIN','CAJERO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Marcas
CREATE TABLE IF NOT EXISTS marca (
    id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN      NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Productos
CREATE TABLE IF NOT EXISTS producto (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    marca_id    BIGINT,
    nombre      VARCHAR(150) NOT NULL,
    descripcion TEXT,
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_producto_marca FOREIGN KEY (marca_id) REFERENCES marca(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Variantes (talla + color por producto)
CREATE TABLE IF NOT EXISTS variante (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY,
    producto_id         BIGINT          NOT NULL,
    color               VARCHAR(50),
    talla               VARCHAR(20),
    ubicacion           VARCHAR(20),
    sku                 VARCHAR(50)     UNIQUE,
    codigo_barras       VARCHAR(100)    UNIQUE,
    precio_compra       DECIMAL(12,2)   NOT NULL,
    porcentaje_ganancia DECIMAL(5,2),
    precio_venta        DECIMAL(12,2)   NOT NULL,
    stock               INT             NOT NULL DEFAULT 0,
    stock_minimo        INT                      DEFAULT 5,
    CONSTRAINT fk_variante_producto FOREIGN KEY (producto_id) REFERENCES producto(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Cajas (sesiones de turno)
CREATE TABLE IF NOT EXISTS cajas (
    id                   BIGINT        AUTO_INCREMENT PRIMARY KEY,
    cajero_id            BIGINT        NOT NULL,
    apertura             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cierre               TIMESTAMP     NULL,
    monto_inicial        DECIMAL(12,2) NOT NULL,
    total_efectivo       DECIMAL(12,2)          DEFAULT 0.00,
    total_yape           DECIMAL(12,2)          DEFAULT 0.00,
    total_tarjeta        DECIMAL(12,2)          DEFAULT 0.00,
    monto_final_esperado DECIMAL(12,2)          DEFAULT 0.00,
    monto_final_real     DECIMAL(12,2)          DEFAULT 0.00,
    diferencia           DECIMAL(12,2)          DEFAULT 0.00,
    estado               VARCHAR(20)   NOT NULL DEFAULT 'ABIERTA',
    CONSTRAINT fk_caja_usuario FOREIGN KEY (cajero_id) REFERENCES users(id),
    CONSTRAINT chk_estado_caja CHECK (estado IN ('ABIERTA','CERRADA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id             BIGINT        AUTO_INCREMENT PRIMARY KEY,
    caja_id        BIGINT        NOT NULL,
    cajero_id      BIGINT        NOT NULL,
    fecha          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal       DECIMAL(12,2) NOT NULL,
    descuento      DECIMAL(12,2)          DEFAULT 0.00,
    total          DECIMAL(12,2) NOT NULL,
    metodo_pago    VARCHAR(50),
    monto_recibido DECIMAL(12,2),
    vuelto         DECIMAL(12,2),
    notas          TEXT,
    CONSTRAINT fk_venta_caja    FOREIGN KEY (caja_id)    REFERENCES cajas(id),
    CONSTRAINT fk_venta_usuario FOREIGN KEY (cajero_id)  REFERENCES users(id),
    CONSTRAINT chk_metodo_pago  CHECK (metodo_pago IN ('EFECTIVO','YAPE','TARJETA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Detalle de venta (precio snapshot — inmutable)
CREATE TABLE IF NOT EXISTS detalle_venta (
    id             BIGINT        AUTO_INCREMENT PRIMARY KEY,
    venta_id       BIGINT        NOT NULL,
    variante_id    BIGINT        NOT NULL,
    cantidad       INT           NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,   -- capturado al vender
    descuento_item  DECIMAL(12,2)          DEFAULT 0.00,
    subtotal       DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_detalle_venta    FOREIGN KEY (venta_id)    REFERENCES ventas(id),
    CONSTRAINT fk_detalle_variante FOREIGN KEY (variante_id) REFERENCES variante(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Índices de rendimiento ────────────────────────────────────────────────────
CREATE INDEX idx_variante_producto   ON variante(producto_id);
CREATE INDEX idx_variante_codbarras  ON variante(codigo_barras);
CREATE INDEX idx_cajas_cajero_estado ON cajas(cajero_id, estado);
CREATE INDEX idx_ventas_caja         ON ventas(caja_id);
CREATE INDEX idx_ventas_cajero       ON ventas(cajero_id);
CREATE INDEX idx_ventas_fecha        ON ventas(fecha);
CREATE INDEX idx_detalle_venta       ON detalle_venta(venta_id);
CREATE INDEX idx_detalle_variante    ON detalle_venta(variante_id);

-- ── Clientes ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
    id               BIGINT        AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(150)  NOT NULL,
    dni              VARCHAR(8)    UNIQUE,
    ruc              VARCHAR(11)   UNIQUE,
    razon_social     VARCHAR(200),
    numero_telefono  VARCHAR(15),
    email            VARCHAR(150),
    direccion        VARCHAR(250),
    activo           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Comprobantes ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comprobantes (
    id                   BIGINT        AUTO_INCREMENT PRIMARY KEY,
    serie                VARCHAR(20)   UNIQUE NOT NULL,
    tipo                 VARCHAR(10)   NOT NULL,
    numero               INT           NOT NULL,
    venta_id             BIGINT        NOT NULL UNIQUE,
    cliente_id           BIGINT,
    -- Snapshot datos cliente
    cliente_nombre       VARCHAR(200),
    cliente_dni          VARCHAR(8),
    cliente_ruc          VARCHAR(11),
    cliente_razon_social VARCHAR(200),
    cliente_direccion    VARCHAR(250),
    cliente_email        VARCHAR(150),
    -- Montos snapshot
    subtotal             DECIMAL(12,2) NOT NULL,
    descuento            DECIMAL(12,2) DEFAULT 0.00,
    total                DECIMAL(12,2) NOT NULL,
    igv                  DECIMAL(12,2),
    base_imponible       DECIMAL(12,2),
    fecha_emision        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comprobante_venta   FOREIGN KEY (venta_id)   REFERENCES ventas(id),
    CONSTRAINT fk_comprobante_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_tipo_comprobante   CHECK (tipo IN ('BOLETA','FACTURA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Índices nuevos
CREATE INDEX idx_comprobantes_fecha    ON comprobantes(fecha_emision);
CREATE INDEX idx_comprobantes_tipo     ON comprobantes(tipo);
CREATE INDEX idx_comprobantes_cliente  ON comprobantes(cliente_id);
CREATE INDEX idx_clientes_dni          ON clientes(dni);
CREATE INDEX idx_clientes_ruc          ON clientes(ruc);

-- ── Proveedores ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proveedor (
    id               BIGINT        AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(150)  NOT NULL,
    ruc              VARCHAR(11)   NOT NULL UNIQUE,
    contacto         VARCHAR(100)  NOT NULL,
    numero_telefono  VARCHAR(15)   NOT NULL,
    email            VARCHAR(150)  NOT NULL,
    direccion        VARCHAR(250)  NOT NULL,
    dias_credito     INT           NOT NULL DEFAULT 0,
    activo           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Solicitudes de compra ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS solicitud_compra (
    id                BIGINT         AUTO_INCREMENT PRIMARY KEY,
    codigo            VARCHAR(30)    NOT NULL UNIQUE,
    proveedor_id      BIGINT         NOT NULL,
    usuario_id        BIGINT         NOT NULL,
    condicion_pago    VARCHAR(20)    NOT NULL,
    fecha_vencimiento DATE,
    fecha_solicitud   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total             DECIMAL(12,2)  NOT NULL,
    pagado            BOOLEAN        NOT NULL DEFAULT FALSE,
    estado            VARCHAR(30)    NOT NULL DEFAULT 'PENDIENTE_RECEPCION',
    observacion       TEXT,
    activo            BOOLEAN        NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_solicitud_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedor(id),
    CONSTRAINT fk_solicitud_usuario   FOREIGN KEY (usuario_id) REFERENCES users(id),
    CONSTRAINT chk_solicitud_condicion_pago CHECK (condicion_pago IN ('CONTADO','CREDITO')),
    CONSTRAINT chk_solicitud_estado CHECK (estado IN ('PENDIENTE_RECEPCION','PARCIAL_RECEPCION','RECEPCIONADA','ANULADA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS detalle_solicitud_compra (
    id                    BIGINT         AUTO_INCREMENT PRIMARY KEY,
    solicitud_compra_id   BIGINT         NOT NULL,
    producto_id           BIGINT         NOT NULL,
    variante_id           BIGINT         NOT NULL,
    cantidad_solicitada   INT            NOT NULL,
    cantidad_recibida     INT            NOT NULL DEFAULT 0,
    precio_unitario       DECIMAL(12,2)  NOT NULL,
    subtotal              DECIMAL(12,2)  NOT NULL,
    CONSTRAINT fk_det_solicitud_compra FOREIGN KEY (solicitud_compra_id) REFERENCES solicitud_compra(id),
    CONSTRAINT fk_det_solicitud_producto FOREIGN KEY (producto_id) REFERENCES producto(id),
    CONSTRAINT fk_det_solicitud_variante FOREIGN KEY (variante_id) REFERENCES variante(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_proveedor_nombre               ON proveedor(nombre);
CREATE INDEX idx_solicitud_proveedor_estado     ON solicitud_compra(proveedor_id, estado);
CREATE INDEX idx_solicitud_fecha                ON solicitud_compra(fecha_solicitud);
CREATE INDEX idx_solicitud_pagado               ON solicitud_compra(pagado);
CREATE INDEX idx_detalle_solicitud_compra_id    ON detalle_solicitud_compra(solicitud_compra_id);
CREATE INDEX idx_detalle_solicitud_variante_id  ON detalle_solicitud_compra(variante_id);

-- ── Gastos de operación ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gasto (
        id          BIGINT         AUTO_INCREMENT PRIMARY KEY,
        tipo        VARCHAR(30)    NOT NULL,
        concepto    VARCHAR(180)   NOT NULL,
        monto       DECIMAL(12,2)  NOT NULL,
        fecha_gasto DATE           NOT NULL,
        descripcion TEXT,
        usuario_id  BIGINT         NOT NULL,
        created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_gasto_usuario FOREIGN KEY (usuario_id) REFERENCES users(id),
        CONSTRAINT chk_tipo_gasto CHECK (tipo IN (
            'CREDITO_PROVEEDOR','LUZ','INTERNET','ALQUILER','PLANILLA','TRANSPORTE','OTRO'
        ))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_gasto_fecha       ON gasto(fecha_gasto);
CREATE INDEX idx_gasto_tipo_fecha  ON gasto(tipo, fecha_gasto);
