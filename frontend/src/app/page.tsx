import Link from 'next/link';
import { getSystemReports } from '@/lib/services/reports';

export default async function Home() {
  const reports = await getSystemReports();

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
          Sistema de Reportes
        </h1>
        <p className="text-gray-500 text-center mb-12 text-lg">
          Panel de control de operaciones comerciales
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`} className="group">
              <div className="h-full p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-6xl font-bold text-blue-600">{report.id}</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {report.name}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {report.description}
                </p>

                <div className="flex items-center text-sm font-medium text-blue-500 mt-auto">
                  Ver reporte &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}