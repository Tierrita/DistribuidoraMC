-- ============================================
-- AGREGAR COLUMNA ITEMS A TABLA PEDIDOS
-- ============================================

-- Agregar la columna items como JSONB
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Verificar que se agregó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos'
AND column_name = 'items';
