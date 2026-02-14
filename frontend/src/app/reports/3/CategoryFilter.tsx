'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryFilter({
    categories,
    initialCategory
}: {
    categories: string[];
    initialCategory?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set('query', value);
        } else {
            params.delete('query');
        }

        // Reset page to 1 whenever filter changes (good practice)
        params.delete('page');

        router.replace(`?${params.toString()}`);
    }

    return (
        <form className="flex gap-2 items-center">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">Categoría:</label>
            <div className="relative">
                <select
                    name="category"
                    id="category"
                    defaultValue={initialCategory || ''}
                    onChange={handleChange}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                >
                    <option value="">Todas</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </form>
    );
}
