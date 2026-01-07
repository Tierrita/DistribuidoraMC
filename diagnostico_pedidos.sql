-- ============================================
-- DIAGNÓSTICO: Verificar políticas RLS de pedidos
-- Ejecutar esto en Supabase SQL Editor
-- ============================================

-- 1. Ver el estado actual de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'pedidos';

-- 2. Ver todas las políticas de la tabla pedidos
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'pedidos';

-- 3. Ver la definición de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'pedidos'
ORDER BY ordinal_position;

-- 4. Probar un UPDATE directamente (reemplaza 1 con un ID real)
UPDATE pedidos 
SET status = 'completado' 
WHERE id = 1
RETURNING *;

-- 5. Ver pedidos actuales
SELECT id, order_number, status, customer_name 
FROM pedidos 
ORDER BY created_at DESC 
LIMIT 5;
