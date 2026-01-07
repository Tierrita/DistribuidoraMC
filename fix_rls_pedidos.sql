-- ============================================
-- SOLUCIÓN: Limpiar y recrear políticas de pedidos
-- Esto debería resolver el error 400 en UPDATE
-- ============================================

-- 1. DESHABILITAR RLS temporalmente para testing
ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;

-- 2. Probar si ahora funciona el UPDATE (reemplaza 1 con ID real)
-- UPDATE pedidos SET status = 'completado' WHERE id = 1 RETURNING *;

-- 3. Si funcionó, VOLVER A HABILITAR RLS con políticas correctas
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- 4. Eliminar TODAS las políticas existentes de pedidos
DROP POLICY IF EXISTS "Permitir lectura pública de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Permitir inserción pública de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Permitir actualización pública de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Permitir eliminación pública de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Enable all access for pedidos" ON pedidos;

-- 5. Crear políticas SIMPLES y COMPLETAS
CREATE POLICY "pedidos_select_policy" 
ON pedidos FOR SELECT 
TO public
USING (true);

CREATE POLICY "pedidos_insert_policy" 
ON pedidos FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "pedidos_update_policy" 
ON pedidos FOR UPDATE 
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "pedidos_delete_policy" 
ON pedidos FOR DELETE 
TO public
USING (true);

-- 6. Verificar que las políticas se crearon
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies
WHERE tablename = 'pedidos'
ORDER BY policyname;

-- 7. Probar UPDATE de nuevo
-- UPDATE pedidos SET status = 'completado' WHERE id = 1 RETURNING *;
