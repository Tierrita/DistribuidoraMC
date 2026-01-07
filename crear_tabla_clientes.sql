-- ============================================
-- TABLA: clientes
-- Para la Distribuidora MC
-- ============================================

CREATE TABLE IF NOT EXISTS clientes (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    cuit TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_name ON clientes(name);
CREATE INDEX IF NOT EXISTS idx_clientes_phone ON clientes(phone);
CREATE INDEX IF NOT EXISTS idx_clientes_cuit ON clientes(cuit);

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;

CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (cambiar en producción)
DROP POLICY IF EXISTS "Permitir lectura pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir inserción pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir actualización pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir eliminación pública de clientes" ON clientes;

CREATE POLICY "Permitir lectura pública de clientes" 
ON clientes FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserción pública de clientes" 
ON clientes FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de clientes" 
ON clientes FOR UPDATE 
USING (true);

CREATE POLICY "Permitir eliminación pública de clientes" 
ON clientes FOR DELETE 
USING (true);

-- Insertar algunos clientes de ejemplo
INSERT INTO clientes (name, phone, address, cuit, notes) VALUES
('Juan Pérez', '011 4567-8900', 'Av. Corrientes 1234, CABA', '20-12345678-9', 'Cliente frecuente - Pedidos semanales'),
('María González', '011 4321-5678', 'Av. Rivadavia 5678, CABA', '27-98765432-1', 'Descuento 10% mayorista'),
('Restaurante El Buen Sabor', '011 5555-1234', 'San Martín 890, San Isidro', '30-11223344-5', 'Pedidos grandes - Entrega martes y viernes'),
('Panadería La Esquina', '011 4444-9876', 'Libertador 456, Vicente López', '30-55667788-9', 'Pedidos matutinos'),
('Carlos Rodríguez', '011 6789-0123', 'Belgrano 789, CABA', '20-33445566-7', NULL)
ON CONFLICT DO NOTHING;

-- Verificar
SELECT * FROM clientes ORDER BY name;
