-- ============================================
-- ARCHIVO: db/reports_vw.sql
-- ============================================

/*
1. VIEW: view_ventas_por_categoria
- Qué devuelve: El rendimiento comercial de cada categoría de productos.
- Grain: Una fila por categoría.
- Métricas: Total ingresos (SUM), cantidad de ventas (COUNT), ticket promedio (AVG).
- Por qué usa GROUP BY/HAVING: Agrupa por categoría para consolidar las métricas de todos los productos pertenecientes a ella.
- VERIFY: 
    SELECT * FROM view_ventas_por_categoria WHERE categoria = 'Electrónica';
    SELECT SUM(ingresos_totales) FROM view_ventas_por_categoria; -- Debe coincidir con el total de orden_detalles
*/
CREATE OR REPLACE VIEW view_ventas_por_categoria AS
SELECT 
    c.nombre AS categoria,
    COUNT(od.id) AS total_ventas_unidades,
    COALESCE(SUM(od.subtotal), 0) AS ingresos_totales,
    ROUND(AVG(od.precio_unitario), 2) AS precio_promedio_producto
FROM categorias c
LEFT JOIN productos p ON c.id = p.categoria_id
LEFT JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY c.id, c.nombre;

/*
2. VIEW: view_clientes_vip
- Qué devuelve: Listado de clientes de alto valor.
- Grain: Una fila por usuario.
- Métricas: Inversión total acumulada.
- Por qué usa GROUP BY/HAVING: Agrupa por usuario y usa HAVING para filtrar solo aquellos cuyo gasto total supera los 500 unidades monetarias.
- VERIFY:
    SELECT MIN(inversion_total) FROM view_clientes_vip; -- Debe ser > 500
*/
CREATE OR REPLACE VIEW view_clientes_vip AS
SELECT 
    u.nombre AS cliente,
    u.email,
    SUM(o.total) AS inversion_total,
    COUNT(o.id) AS total_pedidos
FROM usuarios u
JOIN ordenes o ON u.id = o.usuario_id
GROUP BY u.id, u.nombre, u.email
HAVING SUM(o.total) > 500;

/*
3. VIEW: view_ranking_productos
- Qué devuelve: Los 3 productos más vendidos por cada categoría.
- Grain: Una fila por producto (filtrado por top 3).
- Métricas: Unidades vendidas y posición en el ranking.
- Por qué usa GROUP BY/HAVING: GROUP BY para sumar unidades por producto. Usa CTE y Window Function (RANK) para calcular la posición sin perder el detalle.
- VERIFY:
    SELECT * FROM view_ranking_productos ORDER BY categoria, ranking_en_categoria;
*/
CREATE OR REPLACE VIEW view_ranking_productos AS
WITH stats AS (
    SELECT 
        p.nombre AS producto,
        c.nombre AS categoria,
        SUM(od.cantidad) as unidades,
        RANK() OVER (PARTITION BY c.id ORDER BY SUM(od.cantidad) DESC) as ranking_en_categoria
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    JOIN orden_detalles od ON p.id = od.producto_id
    GROUP BY c.id, c.nombre, p.id, p.nombre
)
SELECT categoria, producto, unidades, ranking_en_categoria
FROM stats 
WHERE ranking_en_categoria <= 3;

/*
4. VIEW: view_analisis_stock
- Qué devuelve: Reporte de disponibilidad con etiquetas de advertencia.
- Grain: Una fila por producto.
- Métricas: Stock actual.
- Por qué usa GROUP BY/HAVING: Agrupa para asegurar que no hay duplicados y aplica CASE significativo para la lógica de negocio.
- VERIFY:
    SELECT * FROM view_analisis_stock WHERE alerta = 'SIN STOCK';
*/
CREATE OR REPLACE VIEW view_analisis_stock AS
SELECT 
    p.nombre AS producto,
    p.stock,
    CASE 
        WHEN p.stock = 0 THEN 'SIN STOCK'
        WHEN p.stock < 10 THEN 'CRÍTICO'
        ELSE 'NORMAL'
    END AS alerta,
    COALESCE(SUM(od.cantidad), 0) AS unidades_vendidas_historicas
FROM productos p
LEFT JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY p.id, p.nombre, p.stock;

/*
5. VIEW: view_eficiencia_ordenes
- Qué devuelve: Resumen de estados de órdenes con filtros de rendimiento.
- Grain: Una fila por estado de orden.
- Métricas: Cantidad de órdenes y monto total por estado.
- Por qué usa GROUP BY/HAVING: Agrupa por 'status' y usa HAVING para excluir estados con menos de 2 registros (ruido estadístico).
- VERIFY:
    SELECT * FROM view_eficiencia_ordenes;
*/
CREATE OR REPLACE VIEW view_eficiencia_ordenes AS
SELECT 
    UPPER(status) AS estado,
    COUNT(*) AS volumen,
    SUM(total) AS monto_acumulado
FROM ordenes
GROUP BY status
HAVING COUNT(*) >= 2;