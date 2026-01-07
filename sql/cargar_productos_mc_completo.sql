-- ============================================
-- CARGA COMPLETA DE PRODUCTOS MC DISTRIBUIDORA
-- Productos de las listas físicas con marcas y pesos
-- ============================================

-- Limpiar productos existentes (OPCIONAL - descomentar si querés empezar de cero)
-- DELETE FROM productos;

-- INSERTAR TODOS LOS PRODUCTOS
INSERT INTO productos (code, name, brand, weight, category, price, stock, unit, min_stock) VALUES
-- Lista principal MC Distribuidora (46 productos)
('PROD0001', 'QUESO MOZZARELLA', 'SEBARELLA', 10, 'quesos', 6490.00, 0, 'kg', 2),
('PROD0002', 'QUESO MOZZARELLA', 'SEBARELLA', 5, 'quesos', 6490.00, 0, 'kg', 2),
('PROD0003', 'QUESO BARRA TYBO', 'DON EUGENIO', 4, 'quesos', 7665.00, 0, 'kg', 2),
('PROD0004', 'QUESO BARRA TYBO', 'LA VALTELLINA', 4, 'quesos', 7725.00, 0, 'kg', 2),
('PROD0005', 'QUESO CREMOSO', 'D-70', 4, 'quesos', 5875.00, 0, 'kg', 2),
('PROD0006', 'QUESO SARDO SEMI/EST.', 'ALIBOR/RASLAC', 2.8, 'quesos', 8960.00, 0, 'kg', 1),
('PROD0007', 'QUESO SARDO EST.', 'D-70', 3.5, 'quesos', 10900.00, 0, 'kg', 1),
('PROD0008', 'QUESO REGGIANITO NEGRO', 'MELINCUE', 7, 'quesos', 13800.00, 0, 'kg', 1),
('PROD0009', 'QUESO CREMA POUCH', 'LA PAULINA', 4, 'quesos', 12500.00, 0, 'kg', 2),
('PROD0010', 'QUESO ROQUEFORT', 'SHERMAN', 2.5, 'quesos', 11800.00, 0, 'kg', 1),
('PROD0011', 'QUESO ROQUEFORT', 'LA QUESERA', 2, 'quesos', 11200.00, 0, 'kg', 1),
('PROD0012', 'QUESO CHEDDAR LIQUIDO', 'LA QUESERA', 3, 'quesos', 27500.00, 0, 'kg', 1),
('PROD0013', 'QUESO CHEDDAR LIQUIDO', 'MILKAUT', 3.5, 'quesos', 34500.00, 0, 'kg', 1),
('PROD0014', 'QUESO CHEDDAR FETAS', 'MILKAUT', 2.2, 'quesos', 39500.00, 0, 'kg', 1),
('PROD0015', 'QUESO PATEGRAS', 'LOS TOLDOS', 3.5, 'quesos', 11900.00, 0, 'kg', 1),
('PROD0016', 'QUESO GOUDA', 'LOS TOLDOS', 3.5, 'quesos', 10950.00, 0, 'kg', 1),
('PROD0017', 'JAMON COCIDO CUADRADO', 'MANAM', 5.5, 'jamones', 7350.00, 0, 'kg', 2),
('PROD0018', 'JAMON COCIDO BOCHA', 'MANAM', 5, 'jamones', 7330.00, 0, 'kg', 2),
('PROD0019', 'JAMON COCIDO', 'EXPOSICION', 5, 'jamones', 9500.00, 0, 'kg', 2),
('PROD0020', 'PATA DE CERDO', 'LA COMARCA', 5.5, 'carnes', 7800.00, 0, 'kg', 2),
('PROD0021', 'PALETA ESPECIAL DE CERDO', 'CABAÑA ANTONATIVA', 5.5, 'carnes', 6750.00, 0, 'kg', 2),
('PROD0022', 'JAMON COCIDO', 'DOS ELES', 5.8, 'jamones', 5500.00, 0, 'kg', 2),
('PROD0023', 'PALETA P/EMP', 'DON ALCIDES', 5, 'carnes', 4250.00, 0, 'kg', 2),
('PROD0024', 'PANCETA AHUMADA', 'FACUNDO', 2.5, 'carnes', 13500.00, 0, 'kg', 1),
('PROD0025', 'LONGANIZA CALABRESA', 'FACUNDO', 1, 'carnes', 13500.00, 0, 'kg', 1),
('PROD0026', 'JAMON CRUDO', 'WEBER', 2.5, 'jamones', 17900.00, 0, 'kg', 1),
('PROD0027', 'SALAME MILAN', 'FACUNDO', 2, 'carnes', 12900.00, 0, 'kg', 1),
('PROD0028', 'SALAMINES TIRA X5', 'MANAM', 1, 'carnes', 12900.00, 0, 'kg', 1),
('PROD0029', 'SALAMI BASTON DE CHACRA', 'MANAM', 0.75, 'carnes', 13900.00, 0, 'kg', 1),
('PROD0030', 'BONDIOLA C/RED', 'CHAC. MANAM', 1, 'carnes', 18500.00, 0, 'kg', 1),
('PROD0031', 'LATA TOMATE TRITURADO', 'LA TOMATERA', 8, 'conservas', 11500.00, 0, 'kg', 3),
('PROD0032', 'CAJA TOMATE TRITURADO', 'FINCA DE SANTIAGO', 8, 'conservas', 12500.00, 0, 'kg', 3),
('PROD0033', 'LATA MORRONES ENTEROS', 'ABETO', 0.85, 'conservas', 4100.00, 0, 'kg', 2),
('PROD0034', 'LATA ESPINACA CORTADAS', 'LA BANDA', 0.85, 'conservas', 1900.00, 0, 'kg', 2),
('PROD0035', 'LATA ANANA EN RODAJAS', 'SIETE LAGOS', 0.85, 'conservas', 6900.00, 0, 'kg', 2),
('PROD0036', 'LATA CHAMPIÑONES', 'SIETE LAGOS', 0.4, 'conservas', 4900.00, 0, 'kg', 2),
('PROD0037', 'LATA PALMITOS EN TROZOS', 'SIETE LAGOS', 0.85, 'conservas', 6500.00, 0, 'kg', 2),
('PROD0038', 'LATA CHOCLOS ENTEROS', 'N1/CEN CAROZO', 5.5, 'conservas', 29500.00, 0, 'kg', 2),
('PROD0039', 'ACEITUNAS VERDES', 'FILETEADAS', 5.5, 'conservas', 30500.00, 0, 'kg', 2),
('PROD0040', 'ACEITUNAS NEGRAS', 'N1/C CAROZO', 5.5, 'conservas', 41500.00, 0, 'kg', 2),
('PROD0041', 'ACEITUNAS VERDES', 'N1 C/CAROZO', 2, 'conservas', 19500.00, 0, 'kg', 2),
('PROD0042', 'ACEITUNAS VERDES', 'FILETEADAS', 2, 'conservas', 20500.00, 0, 'kg', 2),
('PROD0043', 'ACEITUNAS NEGRAS', 'N1 C/CAROZO', 2, 'conservas', 26500.00, 0, 'kg', 2),
('PROD0044', 'ACEITUNAS VERDES', 'DESCAROZADAS', 2, 'conservas', 24000.00, 0, 'kg', 2),
('PROD0045', 'ACEITUNAS NEGRAS', 'RELLENAS C/MORRON', 2, 'conservas', 26500.00, 0, 'kg', 2),
('PROD0046', 'ACEITE DE GIRASOL CAJA', 'GIRASOL DEL ROSARIO', 4, 'aceites', 59600.00, 0, 'kg', 3),

-- Lista complementaria (productos adicionales)
('PROD0047', 'CREMA DE LECHE BALDE', 'CREMAC', 5, 'lacteos', 79000.00, 0, 'kg', 2),
('PROD0048', 'MANTECA PILON', 'CRUZALAT', 2.5, 'lacteos', 118800.00, 0, 'kg', 2),
('PROD0049', 'PAPAS CONGELADAS', 'ADORADAS', 14, 'congelados', 33214.29, 0, 'kg', 5),
('PROD0050', 'PAPAS CONGELADAS', 'RAPIPAP', 15, 'congelados', 31666.67, 0, 'kg', 5),
('PROD0051', 'MAYONESA X CAJA', 'Y.ELA DIA', 2.9, 'condimentos', 102068.97, 0, 'kg', 2),
('PROD0052', 'MAYONESA X CAJA', 'NATURA', 2.9, 'condimentos', 158620.69, 0, 'kg', 2),
('PROD0053', 'MAYONESA INDIVIDUAL', 'NATURA', 0.5, 'condimentos', 316000.00, 0, 'kg', 3),
('PROD0054', 'KETCHUP INDIVIDUAL', 'NATURA', 0.5, 'condimentos', 296000.00, 0, 'kg', 3),
('PROD0055', 'MOSTAZA INDIVIDUAL', 'NATURA', 0.5, 'condimentos', 240000.00, 0, 'kg', 3),
('PROD0056', 'SAL SOBRES INDIVIDUAL', 'INYSA', 2, 'condimentos', 47500.00, 0, 'kg', 3),
('PROD0057', 'QUESO RALLADO IND.', 'LA QUESERA', 0.5, 'quesos', 292000.00, 0, 'kg', 2),
('PROD0058', 'OREGANO ESPECIAL', '537', 1, 'especias', 85000.00, 0, 'kg', 1),
('PROD0059', 'PROVENZAL ESPECIAL', '537', 1, 'especias', 98000.00, 0, 'kg', 1)

ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    weight = EXCLUDED.weight,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    unit = EXCLUDED.unit;

-- Verificar resultados
SELECT COUNT(*) as total_productos FROM productos;
SELECT category, COUNT(*) as cantidad FROM productos GROUP BY category ORDER BY cantidad DESC;
