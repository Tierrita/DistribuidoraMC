-- ============================================
-- AGREGAR COLUMNA CATEGORY A LA TABLA PRODUCTOS
-- Ejecutar ANTES del script 3_insertar_productos_con_categorias.sql
-- ============================================

-- Agregar columna category si no existe
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Crear índice para mejorar búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_productos_category ON productos(category);

-- Verificar que se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'productos' 
ORDER BY ordinal_position;
