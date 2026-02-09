import { useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className={`relative w-full bg-white border-b-[3px] border-primary z-40 sticky top-0 shadow-sm transition-all duration-300 ${isHome ? 'h-24 md:h-48' : 'h-16 md:h-20'}`}>
            {isHome ? (
                // Home Header (Original Style)
                <img
                    src="https://pacciolo-legal-autos.s3.us-east-1.amazonaws.com/imagenes_proyectos/Napoli_Oficial.jpeg"
                    alt="Napoli"
                    className="w-full h-full object-cover object-center"
                />
            ) : (
                // Compact Header for other pages - Now also object-cover
                <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
                    <img
                        src="https://pacciolo-legal-autos.s3.us-east-1.amazonaws.com/imagenes_proyectos/Napoli_Oficial.jpeg"
                        alt="Napoli"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
            )}
        </header>
    );
}
