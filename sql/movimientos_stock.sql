-- =============================
-- Auditoría de Movimientos de Stock
-- =============================

CREATE TABLE IF NOT EXISTS movimientos_stock (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT REFERENCES productos(id),
    fecha TIMESTAMP DEFAULT NOW(),
    cantidad INT NOT NULL,
    motivo VARCHAR(50) NOT NULL, -- venta, ajuste, devolución, anulación
    referencia VARCHAR(100), -- id de venta, pedido, ajuste, etc.
    usuario VARCHAR(100) -- opcional: quién realizó el movimiento
);

-- Ejemplo de inserción al descontar stock por venta
-- INSERT INTO movimientos_stock (producto_id, cantidad, motivo, referencia, usuario)
-- VALUES (123, -2, 'venta', 'VENTA-20260113-0001', 'admin');
