-- ============================================
-- ARCHIVO: db/indexes.sql
-- DESCRIPCIÓN: Optimización de rendimiento para vistas
-- ============================================

-- 1. Índice para mejorar Joins y filtrado en Ordenes
-- Justificación: Optimiza 'view_clientes_vip' y 'view_resumen_ordenes_recientes'
-- al acelerar el JOIN con usuarios y el filtro por status.
CREATE INDEX idx_ordenes_usuario_status ON ordenes(usuario_id, status);

-- 2. Índice para mejorar el cálculo de totales en Detalles
-- Justificación: Optimiza 'view_ventas_por_categoria' y 'view_ranking_productos'.
-- Facilita la agregación (SUM/COUNT) de productos vendidos.
CREATE INDEX idx_orden_detalles_producto_id ON orden_detalles(producto_id);

-- 3. Índice para búsquedas y ordenamiento por Categoría
-- Justificación: Acelera el PARTITION BY de la Window Function en 'view_ranking_productos'
-- y los agrupamientos en 'view_ventas_por_categoria'.
CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);

-- ============================================
-- DEMOSTRACIÓN DE USO (EXPLAIN)
-- ============================================

-- Prueba 1: Optimización de Agregación y Join
--EXPLAIN ANALYZE 
--SELECT * FROM view_ventas_por_categoria;

-- Prueba 2: Optimización de Window Function (Ranking)
--EXPLAIN ANALYZE 
--SELECT * FROM view_ranking_productos WHERE categoria = 'Electrónica';

-- Prueba 3: Filtro de Clientes VIP
--EXPLAIN ANALYZE 
--SELECT * FROM view_clientes_vip;