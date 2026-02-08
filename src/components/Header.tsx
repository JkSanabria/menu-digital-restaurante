import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className={`relative w-full overflow-hidden bg-white border-b-4 border-primary z-40 sticky top-0 shadow-sm transition-all duration-300 ${isHome ? 'h-52' : 'h-24'}`}>
            <img
                src="https://pacciolo-legal-autos.s3.us-east-1.amazonaws.com/imagenes_proyectos/Napoli_Perfil_Principal.jpg"
                alt="Napoli Logo"
                className={`w-full h-full object-cover object-center transition-all duration-300 ${isHome ? 'brightness-100' : 'brightness-50'}`}
            />
            {/* Overlay oscuro solo cuando no es home para resaltar el botón atrás */}
            <div className={`absolute inset-0 bg-black/30 pointer-events-none transition-opacity duration-300 ${isHome ? 'opacity-0' : 'opacity-100'}`} />

            {!isHome && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white font-heading text-2xl drop-shadow-md tracking-wide">
                        Napoli
                    </h1>
                </div>
            )}

            {!isHome && (
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-1/2 -translate-y-1/2 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-primary hover:bg-white transition-colors z-50 active:scale-95"
                    aria-label="Volver"
                >
                    <ArrowLeft size={20} />
                </button>
            )}
        </header>
    );
}
