
import { z } from 'zod';

// ==========================================
// ESQUEMAS PARA VISTAS DE REPORTES
// ==========================================

// 1. view_ventas_por_categoria
export const VentasCategoriaSchema = z.object({
    categoria: z.string(),
    total_ventas_unidades: z.coerce.number(), // Postgres devuelve strings para BigInt
    ingresos_totales: z.coerce.number(),
    precio_promedio_producto: z.coerce.number()
});

// 2. view_clientes_vip
export const ClientesVipSchema = z.object({
    cliente: z.string(),
    email: z.string().email(),
    inversion_total: z.coerce.number(),
    total_pedidos: z.coerce.number()
});

// 3. view_ranking_productos
export const RankingProductosSchema = z.object({
    categoria: z.string(),
    producto: z.string(),
    unidades: z.coerce.number(),
    ranking_en_categoria: z.coerce.number()
});

// 4. view_analisis_stock
export const AnalisisStockSchema = z.object({
    producto: z.string(),
    stock: z.coerce.number(),
    alerta: z.enum(['SIN STOCK', 'CRÍTICO', 'NORMAL']),
    unidades_vendidas_historicas: z.coerce.number()
});

// 5. view_eficiencia_ordenes
export const EficienciaOrdenesSchema = z.object({
    estado: z.string(),
    volumen: z.coerce.number(),
    monto_acumulado: z.coerce.number()
});

// Esquema para parámetros de búsqueda en URL
export const SearchParamsSchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().optional(),
});
