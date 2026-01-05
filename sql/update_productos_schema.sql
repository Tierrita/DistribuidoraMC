-- ============================================
-- ACTUALIZACIÓN DE LA TABLA PRODUCTOS
-- Agregar campos: brand, weight, price_per_kg, cost_price, sale_price
-- ============================================

-- 1. Agregar columna 'brand' (marca)
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS brand TEXT;

-- 2. Agregar columna 'weight' (peso en kg)
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 3) CHECK (weight > 0);

-- 3. Agregar columna 'price_per_kg' (precio por kg)
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS price_per_kg NUMERIC(10, 2) CHECK (price_per_kg > 0);

-- 4. Agregar columna 'cost_price' (precio de costo)
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2) CHECK (cost_price > 0);

-- 5. Agregar columna 'sale_price' (precio de venta)
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10, 2) CHECK (sale_price > 0);

-- 6. Hacer opcionales los campos antiguos que ya no se usan
ALTER TABLE productos 
ALTER COLUMN code DROP NOT NULL;

ALTER TABLE productos 
ALTER COLUMN category DROP NOT NULL;

ALTER TABLE productos 
ALTER COLUMN price DROP NOT NULL;

-- 7. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_brand ON productos(brand);
CREATE INDEX IF NOT EXISTS idx_productos_weight ON productos(weight);

-- ============================================
-- COMENTARIO: Después de ejecutar este script,
-- puedes eliminar las columnas antiguas si ya no las necesitas:
-- ALTER TABLE productos DROP COLUMN code;
-- ALTER TABLE productos DROP COLUMN category;
-- ALTER TABLE productos DROP COLUMN stock;
-- ALTER TABLE productos DROP COLUMN min_stock;
-- ALTER TABLE productos DROP COLUMN price;
-- ALTER TABLE productos DROP COLUMN unit;
-- ============================================
