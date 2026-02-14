-- ============================================
-- ARCHIVO: db/roles.sql
-- DESCRIPCIÓN: Configuración de seguridad y roles
-- ============================================

-- 1. Creación del rol/usuario para la aplicación
-- Se crea con LOGIN para que la app Next.js pueda autenticarse.
DROP ROLE IF EXISTS web_app_user;
CREATE ROLE web_app_user WITH LOGIN PASSWORD 'password_seguro_123';

-- 2. Permisos de conexión y esquema
-- La app debe poder conectarse a la base de datos y "ver" el esquema public.
GRANT CONNECT ON DATABASE lab_reportes TO web_app_user;
GRANT USAGE ON SCHEMA public TO web_app_user;

-- 3. Restricción de acceso a tablas (Seguridad Real)
-- Por defecto, revocamos cualquier permiso previo sobre las tablas base.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM web_app_user;

-- 4. Permisos exclusivos sobre las VIEWS
-- La app NO puede consultar las tablas 'usuarios', 'ordenes', etc., directamente.
-- Solo puede hacer SELECT sobre las vistas de reporte creadas.
GRANT SELECT ON view_ventas_por_categoria TO web_app_user;
GRANT SELECT ON view_clientes_vip TO web_app_user;
GRANT SELECT ON view_ranking_productos TO web_app_user;
GRANT SELECT ON view_analisis_stock TO web_app_user;
GRANT SELECT ON view_eficiencia_ordenes TO web_app_user;

-- Permiso necesario para el filtro de categorías en el frontend
GRANT SELECT ON categorias TO web_app_user;

-- 5. Verificación de permisos (Query de utilidad)
-- Ejecutar esto para confirmar que el usuario no tiene acceso a las tablas:
-- SET ROLE web_app_user;
-- SELECT * FROM usuarios; -- Debería dar error de "permission denied".
-- SELECT * FROM view_ventas_por_categoria; -- Debería funcionar.
-- RESET ROLE;