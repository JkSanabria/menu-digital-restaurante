import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import menuData from '../data/menu.json';
import { MenuData } from '../types/menu';

const data: MenuData = menuData as unknown as MenuData;

export default function SectionView() {
    const { sectionId } = useParams();

    // Redirect Pizza Section to Custom Pizza Page
    if (sectionId === 'pizzas') {
        return <Navigate to="/pizzas" replace />;
    }

    const section = data.find(s => s.id === sectionId);

    if (!section) return <Navigate to="/" replace />;

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg md:max-w-5xl animate-in fade-in slide-in-from-right-8 duration-300 pb-24">
            <div className="flex items-center gap-4 mb-6 md:mb-8 border-b border-gray-200 md:border-b-2 md:border-primary/10 pb-3 md:pb-4">
                <Link to="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-primary lg:hidden">
                    <ChevronRight className="rotate-180" size={24} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-5xl text-gray-900 font-heading font-black tracking-tight uppercase inline">
                        {section.name}
                    </h1>
                    <span className="text-gray-400 text-sm md:text-lg font-normal md:font-medium ml-2 md:block md:ml-0 md:mt-1">
                        Selecciona una categoría
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                {section.subcategories.map((sub) => (
                    <Link
                        key={sub.id}
                        to={`/section/${sectionId}/sub/${sub.id}`}
                        className="group flex items-center justify-between p-3 md:p-8 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 hover:border-primary hover:shadow-lg transition-all active:scale-[0.99] relative overflow-hidden"
                    >
                        <div className="absolute right-0 top-0 w-16 h-16 md:w-24 md:h-24 bg-primary/5 rounded-bl-full -mr-6 -mt-6 md:-mr-8 md:-mt-8 transition-transform group-hover:scale-150 duration-500"></div>

                        <span className="font-heading text-xl md:text-3xl text-gray-800 font-bold group-hover:text-primary transition-colors z-10">{sub.name}</span>
                        <div className="bg-gray-50 p-1.5 md:p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-all z-10 shadow-sm">
                            <ChevronRight size={20} className="md:w-6 md:h-6" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
