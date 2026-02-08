import { Link } from 'react-router-dom';
import menuData from '../data/menu.json';
import { MenuData } from '../types/menu';
import { Phone } from 'lucide-react';

const data: MenuData = menuData as unknown as MenuData;

export default function Home() {
    // Extract specific sections for custom layout
    const bebidasSection = data.find(s => s.id === 'bebidas');
    const alimentosSection = data.find(s => s.id === 'alimentos');

    // Find "Especialidades" image from the subcategory if possible, or use a default/fallback
    const especialidadesSub = alimentosSection?.subcategories.find(sub => sub.id === 'especialidades');
    // We can pick a specific image for Especialidades or reuse the main one
    const especialidadesImage = "https://img.freepik.com/foto-gratis/plato-carne-res-asada-papas-fritas-verduras-ensalada_140725-5853.jpg"; // Example placeholder or find from products

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div className="text-center mb-10">
                <h1 className="text-5xl mb-2 text-primary font-heading drop-shadow-sm">Napoli</h1>
                <p className="text-gray-500 text-lg uppercase tracking-widest font-light border-y border-gray-200 py-2 mx-10">
                    Pizza & Pasta
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {/* BEBIDAS */}
                {bebidasSection && (
                    <Link
                        to={`/section/${bebidasSection.id}`}
                        className="group relative h-32 rounded-xl overflow-hidden shadow-card transition-all active:scale-95 hover:shadow-xl ring-1 ring-black/5"
                    >
                        <img
                            src={bebidasSection.image}
                            alt="Bebidas"
                            className="w-full h-full object-cover brightness-[0.7] group-hover:brightness-90 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-heading text-4xl drop-shadow-lg tracking-wide uppercase group-hover:scale-110 transition-transform duration-300">
                                Bebidas
                            </span>
                        </div>
                    </Link>
                )}

                {/* COMIDAS (Originally Alimentos) */}
                {alimentosSection && (
                    <Link
                        to={`/section/${alimentosSection.id}`}
                        className="group relative h-32 rounded-xl overflow-hidden shadow-card transition-all active:scale-95 hover:shadow-xl ring-1 ring-black/5"
                    >
                        <img
                            src={alimentosSection.image}
                            alt="Comidas"
                            className="w-full h-full object-cover brightness-[0.7] group-hover:brightness-90 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-heading text-4xl drop-shadow-lg tracking-wide uppercase group-hover:scale-110 transition-transform duration-300">
                                Comidas
                            </span>
                        </div>
                    </Link>
                )}

                {/* ESPECIALIDADES DE LA CASA (Direct Link to Subcategory) */}
                {alimentosSection && especialidadesSub && (
                    <Link
                        to={`/section/${alimentosSection.id}/sub/${especialidadesSub.id}`}
                        className="group relative h-40 rounded-xl overflow-hidden shadow-card transition-all active:scale-95 hover:shadow-xl ring-1 ring-black/5 mt-2"
                    >
                        <img
                            src={especialidadesImage}
                            alt="Especialidades"
                            className="w-full h-full object-cover brightness-[0.6] group-hover:brightness-90 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center border-4 border-white/20 m-2 rounded-lg">
                            <span className="text-white font-heading text-4xl drop-shadow-lg leading-none mb-1 group-hover:scale-105 transition-transform duration-300">
                                Especialidades
                            </span>
                            <span className="text-white/90 text-sm tracking-widest font-bold uppercase bg-primary/80 px-3 py-1 rounded-full backdrop-blur-sm">
                                De la Casa
                            </span>
                        </div>
                    </Link>
                )}
            </div>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/573000000000" // Replace with actual number
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-organic text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-700 transition-colors active:scale-90 flex items-center gap-2 animate-in zoom-in duration-300"
            >
                <Phone size={24} fill="currentColor" />
                <span className="font-bold text-sm pr-1">WhatsApp</span>
            </a>
        </div>
    );
}
