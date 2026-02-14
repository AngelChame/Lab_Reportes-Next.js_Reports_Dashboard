
import Link from 'next/link';
import { getVentasPorCategoria } from '@/lib/services/reports';
import { SearchParamsSchema } from '@/lib/definitions';

export default async function VentasPorCategoria({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    // Validar parámetros con Zod (seguridad)
    const parsedParams = SearchParamsSchema.safeParse(params);
    const queryMinRevenue = parsedParams.success ? Number(parsedParams.data.query) || 0 : 0;

    const data = await getVentasPorCategoria(queryMinRevenue);

    // Calcular totales para los KPIs
    const totalIngresos = data.reduce((acc, row) => acc + row.ingresos_totales, 0);
    const totalUnidades = data.reduce((acc, row) => acc + row.total_ventas_unidades, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                            &larr; Volver
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800">Ventas por Categoría</h1>
                    </div>

                    {/* FILTRO DE DIFICULTAD OBLIGATORIA */}
                    <form className="flex gap-2">
                        <input
                            name="query"
                            type="number"
                            defaultValue={queryMinRevenue}
                            placeholder="Ingreso Mínimo..."
                            className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            title="Filtrar por ingreso mínimo"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                            Filtrar
                        </button>
                    </form>
                </div>

                {/* KPIs Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Ingresos Totales (Filtrado)</h3>
                        <div className="text-2xl font-bold text-blue-600 mt-2">
                            ${totalIngresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Unidades Vendidas</h3>
                        <div className="text-2xl font-bold text-gray-800 mt-2">
                            {totalUnidades}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Categorías Mostradas</h3>
                        <div className="text-2xl font-bold text-gray-800 mt-2">
                            {data.length}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4 text-center">Unidades</th>
                                <th className="px-6 py-4 text-right">Precio Promedio</th>
                                <th className="px-6 py-4 text-right">Ingresos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.categoria}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{row.total_ventas_unidades}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">
                                        ${row.precio_promedio_producto.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-blue-600">
                                        ${row.ingresos_totales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No hay categorías con ese nivel de ingresos.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
