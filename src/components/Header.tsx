import { useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className={`relative w-full overflow-hidden bg-white border-b-4 border-primary z-40 sticky top-0 shadow-sm transition-all duration-300 ${isHome ? 'h-52' : 'h-24'}`}>
            <img
                src="https://pacciolo-legal-autos.s3.us-east-1.amazonaws.com/imagenes_proyectos/Napoli_Perfil_Principal.jpg"
                alt="El Gallineral"
                className={`w-full h-full object-cover object-center transition-all duration-300 ${isHome ? 'brightness-100' : 'brightness-50'}`}
            />

            {/* Overlay for non-home pages */}
            <div className={`absolute inset-0 bg-black/30 pointer-events-none transition-opacity duration-300 ${isHome ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true" />

            {/* Title on non-home pages */}
            {!isHome && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-white font-heading text-2xl drop-shadow-md tracking-wide">
                        El Gallineral
                    </h1>
                </div>
            )}
        </header>
    );
}
