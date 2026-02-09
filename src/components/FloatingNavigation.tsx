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
            <div className="max-w-md lg:max-w-5xl mx-auto flex items-center justify-between gap-3 lg:gap-8">
                {/* Back Button - Left */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white text-primary p-4 lg:px-8 lg:py-4 lg:h-16 rounded-full shadow-lg lg:shadow-xl hover:bg-gray-50 active:scale-95 transition-all border-2 border-primary/20 lg:border-primary/30 flex items-center justify-center gap-2 lg:gap-3 min-w-[88px] lg:min-w-[200px]"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                    <span className="text-sm lg:text-base font-bold hidden sm:inline">Volver</span>
                </button>

                {/* Spacer - this will be replaced by FloatingCart when it renders */}
                <div className="flex-1" />

                {/* Home Button - Right */}
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary text-white p-4 lg:px-8 lg:py-4 lg:h-16 rounded-full shadow-lg lg:shadow-xl hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2 lg:gap-3 min-w-[88px] lg:min-w-[200px]"
                    aria-label="Ir al menú principal"
                >
                    <Home className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                    <span className="text-sm lg:text-base font-bold hidden sm:inline">Menú</span>
                </button>
            </div>
        </div>
    );
}
