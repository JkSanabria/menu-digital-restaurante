import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FloatingCart() {
    const { itemCount, total } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on cart page or home page
    if (itemCount === 0 || location.pathname === '/cart' || location.pathname === '/') return null;

    return (
        <button
            onClick={() => navigate('/cart')}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-xl z-40 flex items-center gap-3 animate-in zoom-in duration-300 hover:bg-red-700 active:scale-95 w-[90%] max-w-sm justify-between"
        >
            <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                    <ShoppingCart size={20} />
                </div>
                <span className="font-bold">{itemCount} items</span>
            </div>

            <span className="font-bold text-lg">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total)}
            </span>
        </button>
    );
}
