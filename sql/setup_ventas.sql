-- ============================================
-- EJECUTAR ESTE SCRIPT EN SUPABASE SQL EDITOR
-- ============================================
-- Script simplificado para crear tablas de ventas

-- 1. Verificar que existe la tabla de clientes
-- (Si no existe, ejecuta primero sql/crear_tabla_clientes.sql)

-- 2. Eliminar tablas si existen (PRECAUCIÓN: borra datos)
DROP TABLE IF EXISTS pedido_items CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;

-- 3. Crear tabla de ventas/pedidos
CREATE TABLE pedidos (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    cliente_id BIGINT REFERENCES clientes(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    customer_address VARCHAR(200),
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'entregado')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Crear tabla de items de cada venta
CREATE TABLE pedido_items (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id) ON DELETE SET NULL,
    product_name VARCHAR(100) NOT NULL,
    product_brand VARCHAR(50),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Crear índices
CREATE INDEX idx_pedidos_order_number ON pedidos(order_number);
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at DESC);
CREATE INDEX idx_pedido_items_pedido_id ON pedido_items(pedido_id);

-- 6. Trigger para actualizar fecha
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

-- 7. Row Level Security
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for pedidos" ON pedidos
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for pedido_items" ON pedido_items
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ✅ LISTO! Las tablas están creadas.
-- Ahora puedes usar la aplicación para crear ventas.

SELECT 'Tablas de ventas creadas correctamente!' as mensaje;
