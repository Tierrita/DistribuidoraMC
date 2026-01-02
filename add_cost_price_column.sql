-- Script para agregar la columna cost_price a la tabla productos
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna cost_price si no existe
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2) DEFAULT 0;

-- Actualizar productos existentes con cost_price = 0 si es NULL
UPDATE productos 
SET cost_price = 0 
WHERE cost_price IS NULL;

-- Verificar que se haya agregado correctamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'productos' AND column_name = 'cost_price';
