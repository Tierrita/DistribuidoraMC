-- ============================================
-- PASO 2: CREAR CATEGORÍAS
-- ============================================

-- Borrar categorías existentes si las hay
DELETE FROM categorias;

-- Reiniciar el contador de ID a 1
ALTER SEQUENCE categorias_id_seq RESTART WITH 1;

-- Insertar las categorías
INSERT INTO categorias (id, name, slug, icon, color, description) VALUES
(1, 'Quesos', 'quesos', 'fa-cheese', '#FFD700', 'Variedad de quesos de diferentes marcas y tipos'),
(2, 'Fiambres', 'fiambres', 'fa-bacon', '#FF6B6B', 'Jamones cocidos, paletas y productos cocidos'),
(3, 'Embutidos', 'embutidos', 'fa-hotdog', '#C0392B', 'Salamines, pancetas, bondiolas y embutidos curados'),
(4, 'Conservas', 'conservas', 'fa-jar', '#27AE60', 'Vegetales y frutas en conserva, enlatados'),
(5, 'Aceitunas', 'aceitunas', 'fa-seedling', '#8E44AD', 'Aceitunas verdes y negras en diferentes presentaciones');

-- Verificar que se crearon correctamente
SELECT * FROM categorias ORDER BY id;
