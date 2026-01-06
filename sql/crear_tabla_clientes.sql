-- ============================================
-- TABLA DE CLIENTES - Distribuidora MC
-- ============================================
-- Script para crear la tabla de clientes con todos los campos necesarios

-- Eliminar tabla si existe (cuidado en producción)
DROP TABLE IF EXISTS clientes;

-- Crear tabla clientes
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(200),
    cuit VARCHAR(13),
    status VARCHAR(20) DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de búsquedas
CREATE INDEX idx_clientes_name ON clientes(name);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_phone ON clientes(phone);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_cuit ON clientes(cuit);

-- Comentarios en las columnas
COMMENT ON TABLE clientes IS 'Tabla de clientes de la distribuidora';
COMMENT ON COLUMN clientes.id IS 'ID único del cliente (autoincremental)';
COMMENT ON COLUMN clientes.name IS 'Nombre completo o razón social del cliente';
COMMENT ON COLUMN clientes.email IS 'Correo electrónico del cliente';
COMMENT ON COLUMN clientes.phone IS 'Teléfono de contacto';
COMMENT ON COLUMN clientes.address IS 'Dirección completa del cliente';
COMMENT ON COLUMN clientes.cuit IS 'CUIT o CUIL del cliente';
COMMENT ON COLUMN clientes.status IS 'Estado del cliente: activo o inactivo';
COMMENT ON COLUMN clientes.notes IS 'Notas adicionales sobre el cliente';
COMMENT ON COLUMN clientes.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN clientes.updated_at IS 'Fecha de última actualización';

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones (ajustar según necesidad)
CREATE POLICY "Enable all access for clientes" ON clientes
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Insertar algunos clientes de ejemplo (opcional)
INSERT INTO clientes (name, email, phone, address, cuit, status, notes) VALUES
    ('Juan Pérez', 'juan.perez@email.com', '+54 9 11 1234-5678', 'Av. Corrientes 1234, CABA', '20-12345678-9', 'activo', 'Cliente mayorista'),
    ('María García', 'maria.garcia@email.com', '+54 9 11 8765-4321', 'Av. Santa Fe 5678, CABA', '27-98765432-1', 'activo', 'Cliente frecuente'),
    ('Supermercado El Ahorro S.A.', 'ventas@elahorro.com', '+54 9 11 5555-6666', 'Calle Falsa 123, CABA', '30-11111111-2', 'activo', 'Cadena de supermercados'),
    ('Pedro Rodríguez', 'pedro.r@email.com', '+54 9 11 9999-8888', 'Belgrano 789, CABA', '20-55555555-5', 'inactivo', 'Cliente inactivo desde 2025');

-- Verificar datos insertados
SELECT * FROM clientes ORDER BY id;
