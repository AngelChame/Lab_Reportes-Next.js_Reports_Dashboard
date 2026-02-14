import Link from 'next/link';
import { getAnalisisStock } from '@/lib/services/reports';
import { SearchParamsSchema } from '@/lib/definitions';

export default async function AnalisisStock({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const parsedParams = SearchParamsSchema.safeParse(params);
    const page = parsedParams.success ? Number(parsedParams.data.page) || 1 : 1;
    const limit = 10;

    const { data, totalPages, total } = await getAnalisisStock(page, limit);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                            &larr; Volver
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800">Análisis de Stock</h1>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total: {total} productos
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4 text-center">Stock Actual</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-center">Histórico Ventas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.producto}</td>
                                    <td className="px-6 py-4 text-center text-gray-800 font-bold">{row.stock}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${row.alerta === 'SIN STOCK' ? 'bg-red-50 text-red-700 border-red-200' :
                                                row.alerta === 'CRÍTICO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-green-50 text-green-700 border-green-200'}
                    `}>
                                            {row.alerta}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-500">
                                        {row.unidades_vendidas_historicas} unidades
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Inventario vacío.</td></tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <Link
                            href={`/reports/4?page=${page > 1 ? page - 1 : 1}`}
                            className={`px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            Anterior
                        </Link>
                        <span className="text-sm text-gray-600">
                            Página {page} de {totalPages}
                        </span>
                        <Link
                            href={`/reports/4?page=${page < totalPages ? page + 1 : totalPages}`}
                            className={`px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            Siguiente
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
