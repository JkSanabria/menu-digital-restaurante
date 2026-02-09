import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function FloatingCart() {
    const { itemCount, total, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);

    // Don't show on cart page or home page
    if (itemCount === 0 || location.pathname === '/cart' || location.pathname === '/') return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleClearCart = () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            clearCart();
            setShowMenu(false);
        }
    };

    const handleViewCart = () => {
        setShowMenu(false);
        navigate('/cart');
    };

    return (
        <>
            {/* Backdrop */}
            {showMenu && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
                    onClick={() => setShowMenu(false)}
                    aria-hidden="true"
                />
            )}

            {/* Floating Cart Container */}
            <div className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
                <div className="max-w-md lg:max-w-3xl mx-auto flex items-center justify-center">
                    <div className="relative pointer-events-auto">
                        {/* Context Menu - Appears above cart */}
                        {showMenu && (
                            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-200 min-w-[220px]">
                                <button
                                    onClick={handleViewCart}
                                    className="w-full px-6 py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3 border-b border-gray-100"
                                >
                                    <ShoppingCart size={20} className="text-primary" />
                                    <div>
                                        <div className="font-bold text-gray-900">Ver Carrito</div>
                                        <div className="text-xs text-gray-500">{itemCount} productos</div>
                                    </div>
                                </button>

                                <button
                                    onClick={handleClearCart}
                                    className="w-full px-6 py-4 text-left hover:bg-red-50 active:bg-red-100 transition-colors flex items-center gap-3"
                                >
                                    <Trash2 size={20} className="text-red-500" />
                                    <div>
                                        <div className="font-bold text-red-600">Vaciar Carrito</div>
                                        <div className="text-xs text-red-400">Eliminar todos los items</div>
                                    </div>
                                </button>

                                {/* Close button */}
                                <button
                                    onClick={() => setShowMenu(false)}
                                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Cerrar menú"
                                >
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>
                        )}

                        {/* Main Cart Button */}
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="bg-primary text-white px-6 py-4 lg:h-16 rounded-full shadow-xl flex items-center gap-3 hover:bg-red-700 active:scale-95 transition-all min-w-[200px] lg:min-w-[240px] justify-between"
                            aria-label={`Carrito con ${itemCount} productos - ${formatPrice(total)}`}
                            aria-expanded={showMenu}
                            aria-haspopup="true"
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-full relative">
                                    <ShoppingCart size={20} />
                                    {/* Item count badge */}
                                    <span className="absolute -top-1 -right-1 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                </div>
                                <span className="font-bold text-sm hidden sm:inline">Carrito</span>
                            </div>

                            <span className="font-bold text-base">
                                {formatPrice(total)}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
