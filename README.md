# Sistema de Reportes con Next.js y PostgreSQL

Este proyecto implementa un dashboard de reportes comerciales utilizando **Next.js (App Router)** para el frontend y una base de datos **PostgreSQL** orquestada con Docker.

## 🚀 Cómo Ejecutar (Docker)

1.  **Requisitos**: Docker y Docker Compose instalados.
2.  **Iniciar**:
    Ejecuta el siguiente comando en la raíz del proyecto para levantar la base de datos y el frontend:
    ```bash
    docker-compose up -d --build
    ```
    *(Usa `--build` la primera vez para asegurar que la imagen del frontend se construya correctamente).*

3.  **Acceder**:
    Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

---

## ⚖️ Trade-offs: SQL vs Next.js

Decisiones de diseño sobre dónde procesar los datos:

*   **Agregaciones Pesadas (SQL)**:
    *   *Decisión*: Calcular `SUM(ingresos)` y `COUNT(ventas)` en **Vistas SQL** (`view_ventas_por_categoria`).
    *   *Por qué*: PostgreSQL es mucho más eficiente para scanear y agregar miles de filas que traerlas a Node.js y sumarlas (ahorro de ancho de banda y CPU en el servidor de app).
*   **Formato y Totales de Página (Next.js)**:
    *   *Decisión*: Calcular el "Total de Ingresos" de *todas* las categorías mostradas en el cliente (UI "cards") usando `array.reduce()`.
    *   *Por qué*: Evita una query extra a la base de datos (`SELECT SUM(...) FROM view...`) cuando ya tenemos los datos de las categorías en memoria. Mejora la UI sin costo de DB.
*   **Lógica de Negocio "VIP" (SQL)**:
    *   *Decisión*: Definir qué es un "Cliente VIP" (`> 500` inversión) en SQL.
    *   *Por qué*: Mantiene una definición única de verdad. Si el umbral cambia, se actualiza la vista y todos los reportes (y futuras apps) lo reflejan instantáneamente.

## ⚡ Performance Evidence

Resultados de `EXPLAIN (ANALYZE, BUFFERS)` ejecutados en el entorno Docker:

**1. Reporte de Ventas (Filtro por Ingresos):**
Query: `SELECT * FROM view_ventas_por_categoria WHERE ingresos_totales >= 1000;`
> **Execution Time: ~0.736 ms**
> evidencia: `Buffers: shared hit=...` (Datos servidos desde memoria RAM, sin lectura lenta de disco).

**2. Clientes VIP (Top 10):**
Query: `SELECT * FROM view_clientes_vip ORDER BY inversion_total DESC LIMIT 10;`
> **Execution Time: ~0.605 ms**
> evidencia: Uso eficiente de índices para el ordenamiento y límite.

## 🛡️ Threat Model (Seguridad)

Implementación de medidas de seguridad mínimas:

*   **Prevención de SQL Injection**:
    *   Uso estricto de **Queries Parametrizadas** (ej: `$1`, `$2` en `lib/db.ts`).
    *   Validación de inputs con **Zod** antes de pasarlos a la base de datos (rechaza strings maliciosos).
*   **Principio de Menor Privilegio**:
    *   La App se conecta con el rol `web_app_user`.
    *   Este rol tiene `GRANT SELECT` **SOLO** a las vistas de reportes.
    *   **NO** tiene acceso a las tablas base (`usuarios`, `ordenes`), protegiendo la data cruda ante una eventual brecha.
*   **Manejo de Credenciales**:
    *   Credenciales inyectadas vía Variables de Entorno (`DATABASE_URL`).
    *   La base de datos no expone el puerto 5432 a internet, solo a la red interna de Docker (`frontend` -> `db`).

## 🤖 Bitácora de IA

Pasos clave realizados por el Asistente:

1.  **Corrección de Docker**:
    *   *Problema*: La DB fallaba al inicializar scripts en desorden.
    *   *IA*: Ordenó los scripts (`01_schema`, `02_reports`...) en `docker-compose.yml`.
2.  **Implementación Frontend**:
    *   *Prompt*: "Implementa los reportes faltantes".
    *   *IA*: Creó páginas 2-5, schemas Zod, y lógica de filtros/paginación.
3.  **Debugging**:
    *   *Problema*: "Module not found".
    *   *IA*: Identificó error de rutas relativas y corrigió imports.
4.  **Validación de Requisitos**:
    *   *Check*: Noté que faltaban "Dificultad Obligatoria".
    *   *Acción*: Propuse e implementé filtros (Rep 1 & 3) y paginación (Rep 2 & 4).
