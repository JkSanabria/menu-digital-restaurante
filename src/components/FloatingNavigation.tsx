import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FloatingNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isCart = location.pathname === '/cart';

    // Don't show on home page or cart page
    if (isHome || isCart) return null;

    return (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-4">
            <div className="max-w-md mx-auto flex items-center justify-between gap-3">
                {/* Back Button - Left */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white text-primary p-4 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all border-2 border-primary/20 flex items-center gap-2"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-bold hidden sm:inline">Volver</span>
                </button>

                {/* Spacer - this will be replaced by FloatingCart when it renders */}
                <div className="flex-1" />

                {/* Home Button - Right */}
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2"
                    aria-label="Ir al menú principal"
                >
                    <Home size={20} />
                    <span className="text-sm font-bold hidden sm:inline">Menú</span>
                </button>
            </div>
        </div>
    );
}
