
import { query } from '@/lib/db';
import {
    VentasCategoriaSchema,
    ClientesVipSchema,
    RankingProductosSchema,
    AnalisisStockSchema,
    EficienciaOrdenesSchema
} from '../definitions';
import { z } from 'zod';

// 1. Reporte de Ventas por Categoría (Filtro: Ingreso Mínimo)
export async function getVentasPorCategoria(minRevenue: number = 0) {
    // Queries parametrizados ($1)
    const res = await query(
        `SELECT * FROM view_ventas_por_categoria WHERE ingresos_totales >= $1 ORDER BY ingresos_totales DESC`,
        [minRevenue]
    );

    // Validar datos
    const parsed = z.array(VentasCategoriaSchema).safeParse(res.rows);
    if (!parsed.success) {
        throw new Error("Error de datos en Reporte de Ventas.");
    }
    return parsed.data;
}

// 2. Reporte de Clientes VIP (Paginación: page/limit)
export async function getClientesVip(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const res = await query(
        `SELECT *, COUNT(*) OVER() as full_count 
         FROM view_clientes_vip 
         ORDER BY inversion_total DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const rows = res.rows;
    // Extraer total del count window function si hay filas, sino 0
    const total = Number(rows[0]?.full_count || 0);

    const parsed = z.array(ClientesVipSchema.extend({ full_count: z.coerce.number().optional() })).safeParse(rows);
    if (!parsed.success) {
        throw new Error("Error de datos en Reporte Clientes VIP.");
    }
    return { data: parsed.data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// 3. Ranking de Productos (Filtro: Categoría específica)
export async function getRankingProductos(categoria?: string) {
    let queryText = `SELECT * FROM view_ranking_productos`;
    let params: any[] = [];

    if (categoria && categoria !== 'Todas') {
        queryText += ` WHERE categoria = $1`;
        params.push(categoria);
    }

    queryText += ` ORDER BY categoria, ranking_en_categoria`;

    const res = await query(queryText, params);

    const parsed = z.array(RankingProductosSchema).safeParse(res.rows);
    if (!parsed.success) {
        throw new Error("Error de datos en Ranking Productos.");
    }
    return parsed.data;
}

// 4. Análisis de Stock (Paginación: page/limit)
export async function getAnalisisStock(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const res = await query(
        `SELECT *, COUNT(*) OVER() as full_count 
         FROM view_analisis_stock 
         ORDER BY stock ASC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const rows = res.rows;
    const total = Number(rows[0]?.full_count || 0);

    const parsed = z.array(AnalisisStockSchema.extend({ full_count: z.coerce.number().optional() })).safeParse(rows);
    if (!parsed.success) {
        throw new Error("Error de datos en Análisis Stock.");
    }
    return { data: parsed.data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// 5. Eficiencia de Órdenes
export async function getEficienciaOrdenes() {
    const res = await query(`SELECT * FROM view_eficiencia_ordenes`);

    const parsed = z.array(EficienciaOrdenesSchema).safeParse(res.rows);
    if (!parsed.success) {
        throw new Error("Error de datos en Eficiencia Órdenes.");
    }
    return parsed.data;
}

// Metadatos para el Dashboard
export async function getSystemReports() {
    return [
        { id: 1, name: 'Ventas por Categoría', view: 'view_ventas_por_categoria', description: 'Filtro por Ingresos Mínimos' },
        { id: 2, name: 'Clientes VIP', view: 'view_clientes_vip', description: 'PaginadoServer-Side' },
        { id: 3, name: 'Top Productos', view: 'view_ranking_productos', description: 'Filtro por Categoría' },
        { id: 4, name: 'Alertas de Stock', view: 'view_analisis_stock', description: 'Paginado Server-Side' },
        { id: 5, name: 'Eficiencia de Órdenes', view: 'view_eficiencia_ordenes', description: 'Resumen de Estados' },
    ];
}
