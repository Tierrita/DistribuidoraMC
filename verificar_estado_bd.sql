-- ============================================
-- VERIFICAR ESTADO DE LA BASE DE DATOS
-- Ejecutá esto para ver qué tablas y datos tenés
-- ============================================

-- 1. Ver todas las tablas que existen
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columnas
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Contar registros en cada tabla
SELECT 'categorias' as tabla, COUNT(*) as registros FROM categorias
UNION ALL
SELECT 'productos', COUNT(*) FROM productos
UNION ALL
SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'pedidos', COUNT(*) FROM pedidos
ORDER BY tabla;

-- 3. Ver primeros 5 clientes (si existen)
SELECT id, name, phone, address FROM clientes LIMIT 5;

-- 4. Ver primeros 5 productos
SELECT code, name, category, stock FROM productos LIMIT 5;

-- 5. Ver pedidos (si hay)
SELECT order_number, customer_name, total, status, created_at 
FROM pedidos 
ORDER BY created_at DESC 
LIMIT 5;
