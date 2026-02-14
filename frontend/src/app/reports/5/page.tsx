
import Link from 'next/link';
import { getEficienciaOrdenes } from '@/lib/services/reports';

export default async function EficienciaOrdenes() {
    const data = await getEficienciaOrdenes();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                            &larr; Volver
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800">Eficiencia de Órdenes</h1>
                    </div>
                </div>

                {/* Info Cards - States */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.map((item) => (
                        <div key={item.estado} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.estado}</h3>
                                <div className="text-3xl font-bold text-gray-800 mt-2">{item.volumen}</div>
                                <p className="text-sm text-gray-500 mt-1">Órdenes</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50">
                                <span className="text-sm font-medium text-gray-900">
                                    ${item.monto_acumulado.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-xs text-gray-400 ml-2">acumulado</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table View */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Detalle por Estado</h2>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-center">Volumen de Órdenes</th>
                                <th className="px-6 py-4 text-right">Monto Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.estado}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{item.volumen}</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                                        ${item.monto_acumulado.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
