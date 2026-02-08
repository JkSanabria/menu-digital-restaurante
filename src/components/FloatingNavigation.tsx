import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FloatingNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Don't show on home page
    if (isHome) return null;

    return (
        <div className="fixed top-20 right-4 z-40 flex flex-col gap-3">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="bg-white text-primary p-3 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all border-2 border-primary/20"
                aria-label="Volver atrás"
                title="Volver"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Home Button */}
            <button
                onClick={() => navigate('/')}
                className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-red-700 active:scale-95 transition-all"
                aria-label="Ir al menú principal"
                title="Menú Principal"
            >
                <Home size={24} />
            </button>
        </div>
    );
}
