-- ============================================
-- SISTEMA DE PEDIDOS - Distribuidora MC
-- ============================================
-- Script para crear las tablas de pedidos con relación a clientes

-- ============================================
-- 1. TABLA PRINCIPAL DE PEDIDOS
-- ============================================

-- Eliminar si existe (cuidado en producción)
DROP TABLE IF EXISTS pedido_items CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;

-- Crear tabla de pedidos
CREATE TABLE pedidos (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    cliente_id BIGINT REFERENCES clientes(id) ON DELETE SET NULL,
    
    -- Información del cliente (snapshot al momento del pedido)
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    customer_address VARCHAR(200),
    
    -- Totales del pedido
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    
    -- Estado y seguimiento
    status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_proceso', 'completado', 'entregado', 'cancelado')),
    notes TEXT,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Metadatos adicionales
    payment_method VARCHAR(50),
    paid BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 2. TABLA DE ITEMS DEL PEDIDO
-- ============================================

CREATE TABLE pedido_items (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id) ON DELETE SET NULL,
    
    -- Información del producto (snapshot al momento del pedido)
    product_name VARCHAR(100) NOT NULL,
    product_brand VARCHAR(50),
    product_weight NUMERIC(10, 3),
    
    -- Cantidades y precios
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ÍNDICES PARA MEJORAR PERFORMANCE
-- ============================================

-- Índices para pedidos
CREATE INDEX idx_pedidos_order_number ON pedidos(order_number);
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at DESC);
CREATE INDEX idx_pedidos_customer_name ON pedidos(customer_name);

-- Índices para items
CREATE INDEX idx_pedido_items_pedido_id ON pedido_items(pedido_id);
CREATE INDEX idx_pedido_items_producto_id ON pedido_items(producto_id);

-- ============================================
-- 4. TRIGGERS AUTOMÁTICOS
-- ============================================

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_pedidos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pedidos_updated_at
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_pedidos_updated_at();

-- Trigger para actualizar el total del pedido cuando se agregan/modifican items
CREATE OR REPLACE FUNCTION update_pedido_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pedidos
    SET subtotal = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM pedido_items
        WHERE pedido_id = COALESCE(NEW.pedido_id, OLD.pedido_id)
    ),
    total = (
        SELECT COALESCE(SUM(total_price), 0) - COALESCE(discount, 0)
        FROM pedido_items
        WHERE pedido_id = COALESCE(NEW.pedido_id, OLD.pedido_id)
    )
    WHERE id = COALESCE(NEW.pedido_id, OLD.pedido_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pedido_total_insert
    AFTER INSERT ON pedido_items
    FOR EACH ROW
    EXECUTE FUNCTION update_pedido_total();

CREATE TRIGGER trigger_update_pedido_total_update
    AFTER UPDATE ON pedido_items
    FOR EACH ROW
    EXECUTE FUNCTION update_pedido_total();

CREATE TRIGGER trigger_update_pedido_total_delete
    AFTER DELETE ON pedido_items
    FOR EACH ROW
    EXECUTE FUNCTION update_pedido_total();

-- ============================================
-- 5. FUNCIONES ÚTILES
-- ============================================

-- Función para generar número de pedido único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Formato: ORD-YYYYMMDD-XXXX (Ej: ORD-20260106-0001)
        new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                      LPAD((FLOOR(RANDOM() * 9999) + 1)::TEXT, 4, '0');
        
        -- Verificar si ya existe
        SELECT EXISTS(SELECT 1 FROM pedidos WHERE order_number = new_number) INTO exists;
        
        EXIT WHEN NOT exists;
    END LOOP;
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas las operaciones (ajustar según necesidad)
CREATE POLICY "Enable all access for pedidos" ON pedidos
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for pedido_items" ON pedido_items
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 7. COMENTARIOS EN LAS TABLAS
-- ============================================

COMMENT ON TABLE pedidos IS 'Tabla principal de pedidos de la distribuidora';
COMMENT ON COLUMN pedidos.order_number IS 'Número único de pedido';
COMMENT ON COLUMN pedidos.cliente_id IS 'ID del cliente (foreign key)';
COMMENT ON COLUMN pedidos.status IS 'Estado: pendiente, en_proceso, completado, entregado, cancelado';
COMMENT ON COLUMN pedidos.subtotal IS 'Suma de todos los items';
COMMENT ON COLUMN pedidos.total IS 'Subtotal menos descuento';

COMMENT ON TABLE pedido_items IS 'Detalle de items de cada pedido';
COMMENT ON COLUMN pedido_items.pedido_id IS 'ID del pedido padre';
COMMENT ON COLUMN pedido_items.producto_id IS 'ID del producto (puede ser NULL si se elimina)';
COMMENT ON COLUMN pedido_items.total_price IS 'quantity * unit_price';

-- ============================================
-- 8. DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar un pedido de ejemplo
INSERT INTO pedidos (order_number, cliente_id, customer_name, customer_phone, customer_address, status)
VALUES 
    ('ORD-20260106-0001', 1, 'Juan Pérez', '+54 9 11 1234-5678', 'Av. Corrientes 1234, CABA', 'pendiente');

-- Insertar items del pedido de ejemplo
INSERT INTO pedido_items (pedido_id, producto_id, product_name, product_brand, quantity, unit_price, total_price)
VALUES 
    (1, 1, 'Jamón Cocido', 'Paladini', 2, 1500.00, 3000.00),
    (1, 2, 'Salame Milán', 'Paladini', 1, 2000.00, 2000.00);

-- Verificar datos
SELECT * FROM pedidos;
SELECT * FROM pedido_items;

-- Ver pedido completo con sus items
SELECT 
    p.order_number,
    p.customer_name,
    p.status,
    p.total,
    COUNT(pi.id) as total_items
FROM pedidos p
LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
GROUP BY p.id, p.order_number, p.customer_name, p.status, p.total;
