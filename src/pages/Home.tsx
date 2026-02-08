import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import menuData from '../data/menu.json';
import { MenuData } from '../types/menu';

const data: MenuData = menuData as unknown as MenuData;

export default function Home() {
    // Extract sections with proper null handling
    const comidasSection = data.find(section => section.id === 'comidas');
    const bebidasSection = data.find(section => section.id === 'bebidas');

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Header */}
            <header className="text-center mb-10">
                <h1 className="text-5xl mb-2 text-primary font-heading drop-shadow-sm">
                    El Gallineral
                </h1>
                <p className="text-gray-500 text-lg uppercase tracking-widest font-light border-y border-gray-200 py-2 mx-10">
                    Resto-Bar
                </p>
            </header>

            {/* Menu Sections */}
            <nav className="flex flex-col gap-6" aria-label="Menú principal">
                {/* Comidas Section */}
                {comidasSection && (
                    <Link
                        to={`/section/${comidasSection.id}`}
                        className="group relative h-48 rounded-xl overflow-hidden shadow-card transition-all active:scale-95 hover:shadow-xl ring-1 ring-black/5"
                        aria-label="Ver menú de comidas"
                    >
                        <img
                            src={comidasSection.image}
                            alt=""
                            className="w-full h-full object-cover brightness-[0.7] group-hover:brightness-90 transition-all duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" aria-hidden="true" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-heading text-5xl drop-shadow-lg tracking-wide uppercase group-hover:scale-110 transition-transform duration-300">
                                Comidas
                            </span>
                        </div>
                    </Link>
                )}

                {/* Bebidas Section */}
                {bebidasSection && (
                    <Link
                        to={`/section/${bebidasSection.id}`}
                        className="group relative h-40 rounded-xl overflow-hidden shadow-card transition-all active:scale-95 hover:shadow-xl ring-1 ring-black/5"
                        aria-label="Ver menú de bebidas"
                    >
                        <img
                            src={bebidasSection.image}
                            alt=""
                            className="w-full h-full object-cover brightness-[0.7] group-hover:brightness-90 transition-all duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-organic/90 via-organic/30 to-transparent" aria-hidden="true" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-heading text-5xl drop-shadow-lg tracking-wide uppercase group-hover:scale-110 transition-transform duration-300">
                                Bebidas
                            </span>
                        </div>
                    </Link>
                )}
            </nav>

            {/* WhatsApp Contact Button */}
            <a
                href="https://wa.me/573195997515"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-organic text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-700 transition-colors active:scale-90 flex items-center gap-2 animate-in zoom-in duration-300"
                aria-label="Contactar por WhatsApp"
            >
                <Phone size={24} fill="currentColor" aria-hidden="true" />
                <span className="font-bold text-sm pr-1">WhatsApp</span>
            </a>
        </div>
    );
}
