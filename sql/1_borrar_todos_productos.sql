-- ============================================
-- PASO 1: BORRAR TODOS LOS PRODUCTOS
-- ============================================

-- Borrar todos los productos de la tabla
DELETE FROM productos;

-- Reiniciar el contador de ID a 1
ALTER SEQUENCE productos_id_seq RESTART WITH 1;

-- Verificar que la tabla está vacía
SELECT COUNT(*) as total_productos FROM productos;
