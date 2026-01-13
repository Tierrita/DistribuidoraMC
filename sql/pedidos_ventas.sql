-- =============================
-- SQL: Entidades y relaciones
-- =============================

-- Tabla de clientes (si no existe)
CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100),
    direccion VARCHAR(200)
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT PRIMARY KEY,
    cliente_id BIGINT REFERENCES clientes(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'borrador',
    fecha TIMESTAMP DEFAULT NOW()
);

-- Tabla de pedido_items
CREATE TABLE IF NOT EXISTS pedido_items (
    id BIGINT PRIMARY KEY,
    pedido_id BIGINT REFERENCES pedidos(id),
    producto_id BIGINT,
    nombre VARCHAR(100),
    precio_unitario NUMERIC(12,2),
    cantidad INT
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id BIGINT PRIMARY KEY,
    pedido_id BIGINT REFERENCES pedidos(id),
    cliente_id BIGINT REFERENCES clientes(id),
    fecha TIMESTAMP DEFAULT NOW(),
    total NUMERIC(12,2)
);

-- Tabla de venta_items
CREATE TABLE IF NOT EXISTS venta_items (
    id BIGINT PRIMARY KEY,
    venta_id BIGINT REFERENCES ventas(id),
    producto_id BIGINT,
    nombre VARCHAR(100),
    precio_unitario NUMERIC(12,2),
    cantidad INT
);

-- Opcional: trigger para descontar stock
-- (Requiere tabla productos y campo stock)
-- CREATE OR REPLACE FUNCTION descontar_stock() ...
