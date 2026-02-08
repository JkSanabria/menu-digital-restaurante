import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import menuData from '../data/menu.json';
import { MenuData } from '../types/menu';

const data: MenuData = menuData as unknown as MenuData;

export default function SectionView() {
    const { sectionId } = useParams();
    const section = data.find(s => s.id === sectionId);

    if (!section) return <Navigate to="/" replace />;

    return (
        <div className="container mx-auto px-4 py-6 max-w-lg animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="mb-6 border-b border-primary/20 pb-4">
                <h1 className="text-3xl text-primary font-heading">{section.name}</h1>
                <p className="text-gray-500 text-sm mt-1">Selecciona una categoría</p>
            </div>

            <div className="grid gap-3">
                {section.subcategories.map((sub) => (
                    <Link
                        key={sub.id}
                        to={`/section/${sectionId}/sub/${sub.id}`}
                        className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-orange-100 hover:border-primary/30 hover:shadow-md transition-all active:bg-orange-50"
                    >
                        <span className="font-heading text-xl text-gray-800">{sub.name}</span>
                        <ChevronRight className="text-primary/60" size={20} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
