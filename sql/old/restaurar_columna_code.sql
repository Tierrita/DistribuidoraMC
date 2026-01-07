-- ============================================
-- RESTAURAR COLUMNA 'code' EN LA TABLA PRODUCTOS
-- Esta columna fue eliminada por error
-- ============================================

-- 1. Agregar la columna 'code' de nuevo
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS code TEXT;

-- 2. Generar códigos automáticos para los productos existentes
-- (Esto crea códigos PROD0001, PROD0002, etc.)
UPDATE productos 
SET code = 'PROD' || LPAD(id::TEXT, 4, '0')
WHERE code IS NULL;

-- 3. Hacer la columna NOT NULL después de llenarla
ALTER TABLE productos 
ALTER COLUMN code SET NOT NULL;

-- 4. Agregar constraint UNIQUE
ALTER TABLE productos 
ADD CONSTRAINT productos_code_unique UNIQUE (code);

-- 5. Recrear el índice
CREATE INDEX IF NOT EXISTS idx_productos_code ON productos(code);

-- ============================================
-- VERIFICAR QUE TODO ESTÉ CORRECTO:
-- ============================================
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'productos' 
-- ORDER BY ordinal_position;
