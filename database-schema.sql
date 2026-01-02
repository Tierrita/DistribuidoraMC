-- ============================================
-- ESTRUCTURA DE BASE DE DATOS PARA SUPABASE
-- Distribuidora MC
-- ============================================

-- Eliminar tablas existentes si necesitas recrearlas (¡CUIDADO! Esto borra todos los datos)
-- DROP TABLE IF EXISTS pedidos CASCADE;
-- DROP TABLE IF EXISTS productos CASCADE;
-- DROP TABLE IF EXISTS categorias CASCADE;

-- ============================================
-- TABLA: categorias
-- ============================================

CREATE TABLE IF NOT EXISTS categorias (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT,
    icon TEXT DEFAULT 'fa-box',
    color TEXT DEFAULT '#8B0000',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_categorias_name ON categorias(name);

-- ============================================
-- TABLA: productos
-- ============================================

CREATE TABLE IF NOT EXISTS productos (
    id BIGSERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    unit TEXT DEFAULT 'kg',
    min_stock INTEGER DEFAULT 0 CHECK (min_stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_code ON productos(code);
CREATE INDEX IF NOT EXISTS idx_productos_category ON productos(category);
CREATE INDEX IF NOT EXISTS idx_productos_name ON productos(name);

-- ============================================
-- TABLA: pedidos (para implementar después)
-- ============================================

CREATE TABLE IF NOT EXISTS pedidos (
    id BIGSERIAL PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_email TEXT,
    customer_address TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_proceso', 'completado', 'cancelado')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_order_number ON pedidos(order_number);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_customer_name ON pedidos(customer_name);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at);

-- ============================================
-- FUNCIONES PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at (eliminar si existen primero)
DROP TRIGGER IF EXISTS update_categorias_updated_at ON categorias;
DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;

CREATE TRIGGER update_categorias_updated_at
    BEFORE UPDATE ON categorias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar Row Level Security
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA CATEGORIAS
-- ============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura pública de categorias" ON categorias;
DROP POLICY IF EXISTS "Permitir inserción pública de categorias" ON categorias;
DROP POLICY IF EXISTS "Permitir actualización pública de categorias" ON categorias;
DROP POLICY IF EXISTS "Permitir eliminación pública de categorias" ON categorias;

-- Permitir lectura pública
CREATE POLICY "Permitir lectura pública de categorias" 
ON categorias FOR SELECT 
USING (true);

-- Permitir inserción pública (cambiar según necesidades de seguridad)
CREATE POLICY "Permitir inserción pública de categorias" 
ON categorias FOR INSERT 
WITH CHECK (true);

-- Permitir actualización pública
CREATE POLICY "Permitir actualización pública de categorias" 
ON categorias FOR UPDATE 
USING (true);

-- Permitir eliminación pública
CREATE POLICY "Permitir eliminación pública de categorias" 
ON categorias FOR DELETE 
USING (true);

-- ============================================
-- POLÍTICAS PARA PRODUCTOS
-- ============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON productos;
DROP POLICY IF EXISTS "Permitir inserción pública de productos" ON productos;
DROP POLICY IF EXISTS "Permitir actualización pública de productos" ON productos;
DROP POLICY IF EXISTS "Permitir eliminación pública de productos" ON productos;

-- Permitir lectura pública
CREATE POLICY "Permitir lectura pública de productos" 
ON productos FOR SELECT 
USING (true);

-- Permitir inserción pública
CREATE POLICY "Permitir inserción pública de productos" 
ON productos FOR INSERT 
WITH CHECK (true);

-- Permitir actualización pública
CREATE POLICY "Permitir actualización pública de productos" 
ON productos FOR UPDATE 
USING (true);

-- Permitir eliminación pública
CREATE POLICY "Permitir eliminación pública de productos" 
ON productos FOR DELETE 
USING (true);

-- ============================================
-- POLÍTICAS PARA PEDIDOS
-- ============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura pública de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Permitir inserción pública de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Permitir actualización pública de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Permitir eliminación pública de pedidos" ON pedidos;

-- Permitir lectura pública
CREATE POLICY "Permitir lectura pública de pedidos" 
ON pedidos FOR SELECT 
USING (true);

-- Permitir inserción pública
CREATE POLICY "Permitir inserción pública de pedidos" 
ON pedidos FOR INSERT 
WITH CHECK (true);

-- Permitir actualización pública
CREATE POLICY "Permitir actualización pública de pedidos" 
ON pedidos FOR UPDATE 
USING (true);

-- Permitir eliminación pública
CREATE POLICY "Permitir eliminación pública de pedidos" 
ON pedidos FOR DELETE 
USING (true);

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar categorías de ejemplo
INSERT INTO categorias (name, slug, icon, color, description) VALUES
('Jamones', 'jamones', 'fa-bacon', '#8B0000', 'Jamón cocido, crudo, serrano y más variedades premium'),
('Quesos', 'quesos', 'fa-cheese', '#FFA500', 'Selección de quesos nacionales e importados'),
('Embutidos', 'embutidos', 'fa-sausage', '#DC143C', 'Salames, chorizos, mortadelas y más'),
('Carnes Frías', 'carnes', 'fa-drumstick-bite', '#CD5C5C', 'Pavita, pollo, lomito y especialidades'),
('Productos Gourmet', 'gourmet', 'fa-bread-slice', '#DAA520', 'Patés, aceitunas, pickles y delicatessen'),
('Pescados y Mariscos', 'pescados', 'fa-fish', '#4682B4', 'Conservas y productos del mar')
ON CONFLICT DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO productos (code, name, category, price, stock, unit, min_stock) VALUES
('JAM001', 'Jamón Cocido Premium', 'jamones', 2500.00, 45, 'kg', 20),
('JAM002', 'Jamón Crudo Serrano', 'jamones', 4500.00, 25, 'kg', 10),
('QUE001', 'Queso Parmesano', 'quesos', 3200.00, 15, 'kg', 10),
('QUE002', 'Queso Roquefort', 'quesos', 2800.00, 30, 'kg', 15),
('EMB001', 'Salame Milano', 'embutidos', 1800.00, 8, 'kg', 15),
('CAR001', 'Pavita Natural', 'carnes', 1500.00, 5, 'kg', 20)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver las tablas creadas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as num_columns
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Ver las políticas de seguridad
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
SEGURIDAD EN PRODUCCIÓN:
------------------------
Para un entorno de producción, deberías:

1. Implementar autenticación de usuarios
2. Cambiar las políticas RLS para que solo usuarios autenticados puedan modificar datos
3. Crear roles diferentes (admin, vendedor, etc.)
4. Ejemplo de política más segura:

    CREATE POLICY "Solo usuarios autenticados pueden modificar" 
    ON productos FOR UPDATE 
    USING (auth.role() = 'authenticated');

BACKUPS:
--------
Supabase hace backups automáticos diarios, pero puedes:
1. Exportar datos manualmente desde el dashboard
2. Usar pg_dump para backups programáticos
3. Implementar webhooks para backup en tiempo real

OPTIMIZACIÓN:
-------------
1. Los índices ya están creados para las columnas más consultadas
2. Considera agregar más índices si haces búsquedas complejas
3. Monitorea el rendimiento desde el dashboard de Supabase

REALTIME:
---------
Para activar actualizaciones en tiempo real:
1. Ve a Database > Replication en Supabase
2. Activa replication para las tablas que necesites
3. En el código, usa supabase.channel() para suscribirte
*/
