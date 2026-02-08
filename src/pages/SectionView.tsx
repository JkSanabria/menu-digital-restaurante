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
            <div className="flex items-baseline gap-3 mb-4 border-b border-primary/20 pb-2">
                <h1 className="text-2xl text-primary font-heading font-bold">{section.name}</h1>
                <span className="text-gray-400 text-xs font-light">Selecciona una categoría</span>
            </div>

            <div className="grid gap-2">
                {section.subcategories.map((sub) => (
                    <Link
                        key={sub.id}
                        to={`/section/${sectionId}/sub/${sub.id}`}
                        className="flex items-center justify-between py-2 px-3 bg-white rounded-lg shadow-sm border border-orange-100 hover:border-primary/30 hover:shadow-md transition-all active:bg-orange-50"
                    >
                        <span className="font-heading text-lg text-gray-800 font-medium leading-tight">{sub.name}</span>
                        <ChevronRight className="text-primary/60" size={18} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
