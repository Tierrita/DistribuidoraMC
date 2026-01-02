-- Tabla de Clientes para Distribuidora MC
-- Ejecutar este SQL en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS clientes (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    email VARCHAR(255),
    debt DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_clientes_phone ON clientes(phone);
CREATE INDEX IF NOT EXISTS idx_clientes_name ON clientes(name);
CREATE INDEX IF NOT EXISTS idx_clientes_debt ON clientes(debt);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Política: permitir todas las operaciones (ajustar según necesidades)
CREATE POLICY "Enable all operations for authenticated users" ON clientes
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE clientes IS 'Tabla de clientes de Distribuidora MC';
COMMENT ON COLUMN clientes.id IS 'ID único del cliente (ej: CLI0001)';
COMMENT ON COLUMN clientes.debt IS 'Deuda pendiente del cliente';
