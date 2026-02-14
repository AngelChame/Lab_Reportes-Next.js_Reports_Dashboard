import Link from 'next/link';
import { getRankingProductos } from '@/lib/services/reports';
import { SearchParamsSchema } from '@/lib/definitions';
import { query } from '@/lib/db';
import CategoryFilter from './CategoryFilter'; // Import the new component

export default async function RankingProductos({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const parsedParams = SearchParamsSchema.safeParse(params);
    const selectedCategory = parsedParams.success ? parsedParams.data.query : undefined;

    const data = await getRankingProductos(selectedCategory);

    // Fetch categories for dropdown (using existing setup)
    const categoriesRes = await query(`SELECT nombre FROM categorias ORDER BY nombre`);
    const categories = categoriesRes.rows.map(r => r.nombre);

    // Agrupar por categoría para mostrar secciones
    const grouped = data.reduce((acc, item) => {
        if (!acc[item.categoria]) acc[item.categoria] = [];
        acc[item.categoria].push(item);
        return acc;
    }, {} as Record<string, typeof data>);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                            &larr; Volver
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800">Top Productos</h1>
                    </div>

                    {/* FILTRO DE DIFICULTAD OBLIGATORIA */}
                    <CategoryFilter categories={categories} initialCategory={selectedCategory} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(grouped).map(([categoria, items]) => (
                        <div key={categoria} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                                <h2 className="font-semibold text-lg text-gray-800">{categoria}</h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <li key={item.producto} className="px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`
                                        flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                                        ${item.ranking_en_categoria === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                    item.ranking_en_categoria === 2 ? 'bg-gray-200 text-gray-700' :
                                                        'bg-orange-100 text-orange-800'}
                                    `}>
                                                #{item.ranking_en_categoria}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700">{item.producto}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                            {item.unidades} u.
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
