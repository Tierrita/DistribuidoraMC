-- ============================================
-- TABLA DE CLIENTES - Distribuidora MC
-- ============================================

-- IMPORTANTE: Esta línea borra la tabla y todos sus datos
-- Si la tabla tiene datos que quieres conservar, coméntalos primero
DROP TABLE IF EXISTS clientes CASCADE;

-- Crear tabla de clientes desde cero
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    cuit TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_name ON clientes(name);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cuit ON clientes(cuit);

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;

CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar Row Level Security
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir inserción pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir actualización pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir eliminación pública de clientes" ON clientes;

-- Permitir lectura pública
CREATE POLICY "Permitir lectura pública de clientes" 
ON clientes FOR SELECT 
USING (true);

-- Permitir inserción pública
CREATE POLICY "Permitir inserción pública de clientes" 
ON clientes FOR INSERT 
WITH CHECK (true);

-- Permitir actualización pública
CREATE POLICY "Permitir actualización pública de clientes" 
ON clientes FOR UPDATE 
USING (true);

-- Permitir eliminación pública
CREATE POLICY "Permitir eliminación pública de clientes" 
ON clientes FOR DELETE 
USING (true);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Insertar clientes de ejemplo
INSERT INTO clientes (name, email, phone, address, cuit, notes) VALUES
('Restaurant El Buen Sabor', 'pedidos@elbuensabor.com', '11-2345-6789', 'Av. Corrientes 1234, CABA', '30-12345678-9', 'Cliente frecuente - Descuento 10%'),
('Parrilla Don José', 'donjose@gmail.com', '11-3456-7890', 'San Martín 456, San Isidro', '30-23456789-0', 'Pedidos semanales de carne'),
('Pizzería La Napolitana', 'info@lanapolitana.com', '11-4567-8901', 'Belgrano 789, Vicente López', '30-34567890-1', 'Especialidad en quesos'),
('Almacén Santa Rosa', 'santarosa@hotmail.com', '11-5678-9012', 'Rivadavia 234, Quilmes', '30-45678901-2', 'Compras mayoristas'),
('Café & Bar Central', 'cafecentral@gmail.com', '11-6789-0123', 'Florida 567, CABA', '30-56789012-3', 'Pedidos diarios de fiambres');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver los clientes creados
SELECT id, name, email, phone, cuit FROM clientes ORDER BY name;

-- Ver estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'clientes'
ORDER BY ordinal_position;
