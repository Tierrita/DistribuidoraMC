-- ============================================
-- LIMPIAR COLUMNAS VIEJAS DE LA TABLA PRODUCTOS
-- Este script elimina las columnas que ya no se usan en el nuevo sistema
-- ============================================

-- IMPORTANTE: Ejecutar este script solo después de confirmar que
-- no hay datos importantes en las columnas que se van a eliminar

-- 1. Eliminar columna 'code' (ya no se usa, ahora solo ID)
ALTER TABLE productos 
DROP COLUMN IF EXISTS code;

-- 2. Eliminar columna 'category' (eliminamos el sistema de categorías)
ALTER TABLE productos 
DROP COLUMN IF EXISTS category;

-- 3. Eliminar columna 'stock' (no lo usamos actualmente)
ALTER TABLE productos 
DROP COLUMN IF EXISTS stock;

-- 4. Eliminar columna 'min_stock' (no lo usamos actualmente)
ALTER TABLE productos 
DROP COLUMN IF EXISTS min_stock;

-- 5. Eliminar columna 'price' (ahora usamos price_per_kg)
ALTER TABLE productos 
DROP COLUMN IF EXISTS price;

-- 6. Eliminar columna 'unit' (siempre es kg ahora)
ALTER TABLE productos 
DROP COLUMN IF EXISTS unit;

-- 7. Verificar la estructura final de la tabla
-- Debería tener solo: id, name, brand, weight, price_per_kg, cost_price, sale_price, created_at, updated_at

-- Para verificar después de ejecutar:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'productos' 
-- ORDER BY ordinal_position;
