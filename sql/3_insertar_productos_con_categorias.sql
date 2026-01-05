-- ============================================
-- PASO 3: INSERTAR PRODUCTOS CON CATEGORÍAS
-- ============================================

-- Borrar productos existentes (por si acaso)
DELETE FROM productos;
ALTER SEQUENCE productos_id_seq RESTART WITH 1;

-- ============================================
-- CATEGORÍA 1: QUESOS (17 productos)
-- ============================================

INSERT INTO productos (name, brand, category, weight, price_per_kg, cost_price, sale_price) VALUES
('QUESO MOZZARELLA', 'SEBARRELLA', 'quesos', 10, 6490.00, 45430.00, 64900.00),
('QUESO MOZZARELLA', 'SEBARRELLA', 'quesos', 5, 7690.00, 26915.00, 38450.00),
('QUESO BARRA TYBO', 'DON EUGENIO', 'quesos', 4, 7250.00, 20300.00, 29000.00),
('QUESO BARRA TYBO', 'LA VALTENA', 'quesos', 4, 5750.00, 16100.00, 23000.00),
('QUESO CREMOSO', 'D-70', 'quesos', 2.8, 8900.00, 17444.00, 24920.00),
('QUESO SARDO SEMI/EST.', 'ALBORADA/RACLAC', 'quesos', 5.5, 10500.00, 40425.00, 57750.00),
('QUESO SARDO EST.', 'D-70', 'quesos', 3.5, 13800.00, 33810.00, 48300.00),
('QUESO REGGIANITO NEGRO', 'MELINCUE', 'quesos', 7, 12500.00, 61250.00, 87500.00),
('QUESO CREMA POUCH', 'LA PAULINA', 'quesos', 4, 11800.00, 33040.00, 47200.00),
('QUESO ROQUEFORT', 'SHERMAR', 'quesos', 2.5, 13800.00, 24150.00, 34500.00),
('QUESO ROQUEFORT', 'LA QUESERA', 'quesos', 2.5, 27500.00, 48125.00, 68750.00),
('QUESO ROQUEFORT', 'LA QUESERA', 'quesos', 3, 34500.00, 72450.00, 103500.00),
('QUESO CHEDDAR LIQUIDO', 'MILKAUT', 'quesos', 3.5, 39500.00, 96775.00, 138250.00),
('QUESOS CHEDDAR LIQUIDO', 'MILKAUT', 'quesos', 7.2, 39500.00, 199080.00, 284400.00),
('QUESO CHEDDAR FETAS', 'MILKAUT', 'quesos', 3.5, 11500.00, 28175.00, 40250.00),
('QUESO PATEGRÁS', 'LOS TOLDOS', 'quesos', 3.5, 10950.00, 26797.50, 38325.00),
('QUESO GOUDA', 'LOS TOLDOS', 'quesos', 5.5, 7350.00, 28297.50, 40425.00);

-- ============================================
-- CATEGORÍA 2: FIAMBRES (7 productos)
-- ============================================

INSERT INTO productos (name, brand, category, weight, price_per_kg, cost_price, sale_price) VALUES
('JAMON COCIDO CUADRADO', 'MANAM', 'fiambres', 5, 7350.00, 25725.00, 36750.00),
('JAMON COCIDO CUADRADO', 'MANAM', 'fiambres', 5, 9500.00, 33250.00, 47500.00),
('JAMON COCIDO BOCHA', 'EXPOSICION', 'fiambres', 5.5, 7800.00, 30030.00, 42900.00),
('JAMON COCIDO', 'LA COMARCA', 'fiambres', 5.5, 6750.00, 25987.50, 37125.00),
('JAMON COCIDO', 'DON ALFREDO', 'fiambres', 2.5, 13500.00, 23625.00, 33750.00),
('PATA DE CERDO', 'CABANA ANTINUVA', 'fiambres', 5.8, 5500.00, 22330.00, 31900.00),
('PALETA ESPECIAL DE CERDO', 'DOS ELES', 'fiambres', 5, 4250.00, 14875.00, 21250.00);

-- ============================================
-- CATEGORÍA 3: EMBUTIDOS (5 productos)
-- ============================================

INSERT INTO productos (name, brand, category, weight, price_per_kg, cost_price, sale_price) VALUES
('PALETA P/EMP.', 'FACUNDO', 'embutidos', 1, 13500.00, 9450.00, 13500.00),
('PANCETA AHUMADA', 'FACUNDO', 'embutidos', 2.5, 17900.00, 31325.00, 44750.00),
('LONGANIZA CALABRESA', 'WEBER', 'embutidos', 4, 21900.00, 61320.00, 87600.00),
('JAMON CRUDO', 'FACUNDO', 'embutidos', 1, 12900.00, 9030.00, 12900.00),
('SALAME MILAN', 'MANAM', 'embutidos', 0.75, 13990.00, 7343.25, 10492.50),
('SALAMINES TIRA X5', 'MANAM', 'embutidos', 1, 18500.00, 12950.00, 18500.00),
('SALAME BASTON DE CHACRA', 'CHAC. MANAM', 'embutidos', 8, 11500.00, 64400.00, 92000.00),
('BONDIOLA C/RED', 'LA TOMATERA', 'embutidos', 8, 12500.00, 70000.00, 100000.00);

-- ============================================
-- CATEGORÍA 4: CONSERVAS (8 productos)
-- ============================================

INSERT INTO productos (name, brand, category, weight, price_per_kg, cost_price, sale_price) VALUES
('LATA TOMATE TRITURADO', 'FINCA DE SANTIAGO', 'conservas', 0.85, 4100.00, 2439.50, 3485.00),
('CAJA TOMATE TRITURADO', 'ARETO', 'conservas', 0.85, 3900.00, 2319.50, 3315.00),
('LATA MORRONES ENTEROS', 'LA BANDA', 'conservas', 0.85, 6900.00, 4104.50, 5865.00),
('LATA ESPINACA CORTADAS', 'SIETE LAGOS', 'conservas', 0.4, 4900.00, 1372.00, 1960.00),
('LATA ANANA EN RODAJAS', 'SIETE LAGOS', 'conservas', 0.85, 6500.00, 3867.50, 5525.00),
('LATA CHAMPINONES', 'SIETE LAGOS', 'conservas', 0.4, 29500.00, 8260.00, 11800.00),
('LATA PALMITOS EN TROZOS', 'N1/CON CAROZO', 'conservas', 5.5, 30500.00, 117425.00, 167750.00);

-- ============================================
-- CATEGORÍA 5: ACEITUNAS (8 productos)
-- ============================================

INSERT INTO productos (name, brand, category, weight, price_per_kg, cost_price, sale_price) VALUES
('ACEITUNAS VERDES FILETEADAS', 'N1', 'aceitunas', 3.5, 11500.00, 28175.00, 40250.00),
('ACEITUNAS VERDES C/CAROZO', 'N1', 'aceitunas', 2, 19500.00, 27300.00, 39000.00),
('ACEITUNAS NEGRAS C/CAROZO', 'N1', 'aceitunas', 2, 10000.00, 14000.00, 20000.00),
('ACEITUNAS VERDES FILETEADAS', 'N1', 'aceitunas', 2, 9500.00, 13300.00, 19000.00),
('ACEITUNAS VERDES C/CAROZO', 'N1', 'aceitunas', 2, 9000.00, 12600.00, 18000.00),
('ACEITUNAS NEGRAS DESCAROZADAS', 'N1', 'aceitunas', 2, 9000.00, 12600.00, 18000.00);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Contar productos por categoría
SELECT category, COUNT(*) as cantidad 
FROM productos 
GROUP BY category 
ORDER BY category;

-- Total de productos
SELECT COUNT(*) as total_productos FROM productos;

-- Ver todos los productos con sus IDs
SELECT id, name, brand, category, weight, price_per_kg, cost_price, sale_price 
FROM productos 
ORDER BY category, id;
