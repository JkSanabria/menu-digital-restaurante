import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import menuData from '../data/menu.json';
import { MenuData, Product } from '../types/menu';
import { useCart } from '../context/CartContext';
import { Plus, Minus, X, ChevronRight } from 'lucide-react';

const data: MenuData = menuData as unknown as MenuData;

// Currency formatter
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function ProductList() {
    const { sectionId, subId } = useParams();
    const { addToCart, updateQuantity, total, items } = useCart();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const section = data.find(s => s.id === sectionId);
    const subcategory = section?.subcategories.find(sub => sub.id === subId);

    if (!section || !subcategory) return <Navigate to="/" replace />;

    const handleAddToCart = () => {
        if (!selectedProduct) return;

        // Add the product multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(selectedProduct);
        }

        // Reset modal
        setSelectedProduct(null);
        setQuantity(1);
    };

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8 max-w-lg md:max-w-5xl animate-in fade-in slide-in-from-right-8 duration-300 pb-32">
                {/* Header Compacto */}
                <div className="flex items-center gap-4 mb-6 md:mb-8 border-b border-gray-200 md:border-b-2 md:border-primary/10 pb-3 md:pb-4">
                    <Link to={`/section/${sectionId}`} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-primary">
                        <ChevronRight className="rotate-180" size={24} />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-5xl font-heading font-black text-gray-900 tracking-tight uppercase inline">
                            {subcategory.name}
                        </h1>
                        <span className="text-gray-400 text-sm md:text-lg font-normal md:font-bold uppercase tracking-widest ml-2 md:block md:ml-0 md:mt-1">
                            {section.name}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 md:gap-6">
                    {subcategory.categories.map((category) => (
                        <div key={category.id} className="scroll-mt-24" id={category.id}>
                            {category.products.map((product) => {
                                const cartItem = items.find(item => item.id === product.id);
                                const quantity = cartItem ? cartItem.quantity : 0;

                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => openModal(product)}
                                        className="group bg-white rounded-xl md:rounded-2xl p-3 md:p-8 shadow-sm border border-gray-100 flex items-center justify-between gap-3 md:gap-4 transition-all hover:border-primary hover:shadow-lg active:scale-[0.99] cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                                            <h3 className="font-heading text-base md:text-xl font-bold text-gray-800 leading-tight line-clamp-2 flex-1">
                                                {product.name}
                                            </h3>

                                            {/* Info Icon */}
                                            <div className="text-gray-300 group-hover:text-primary transition-colors p-1 shrink-0">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="16" x2="12" y2="12" />
                                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 md:gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <span className="font-black text-lg md:text-2xl text-primary whitespace-nowrap">
                                                {formatPrice(product.price)}
                                            </span>

                                            <div className="shrink-0">
                                                {quantity > 0 ? (
                                                    <div className="flex items-center bg-gray-50 rounded-lg p-0.5 md:p-1 border border-gray-200 gap-1 md:gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateQuantity(product.id, quantity - 1);
                                                            }}
                                                            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-red-500 active:scale-95 transition-all"
                                                        >
                                                            <Minus size={16} className="md:w-5 md:h-5" />
                                                        </button>
                                                        <span className="w-6 md:w-8 text-center font-bold text-sm md:text-xl text-gray-800">{quantity}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(product);
                                                            }}
                                                            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center bg-primary text-white rounded-md shadow-sm hover:bg-red-700 active:scale-95 transition-all"
                                                        >
                                                            <Plus size={16} className="md:w-5 md:h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product);
                                                        }}
                                                        className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100 active:scale-90"
                                                        aria-label="Agregar al carrito"
                                                    >
                                                        <Plus size={20} className="md:w-7 md:h-7" strokeWidth={3} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Quantity Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 animate-in slide-in-from-bottom-8 duration-300 sm:slide-in-from-bottom-0">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 pr-4">
                                <h3 className="font-heading text-2xl text-gray-900 leading-tight mb-1">
                                    {selectedProduct.name}
                                </h3>
                                <p className="text-sm text-gray-500">{selectedProduct.description}</p>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {selectedProduct.image && (
                            <div className="mb-6 rounded-xl overflow-hidden aspect-video shadow-md border border-gray-100">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6">
                            <span className="text-gray-600 font-medium">Cantidad</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors active:scale-90"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors active:scale-90"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-600">Precio unitario</span>
                            <span className="font-bold text-lg text-gray-900">{formatPrice(selectedProduct.price)}</span>
                        </div>

                        {/* Current Cart Summary */}
                        {itemCount > 0 && (
                            <div className="bg-gradient-to-r from-primary/10 to-orange-50 p-4 rounded-xl mb-4 border border-primary/20">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600 font-medium">🛒 Carrito actual:</span>
                                    <span className="font-bold text-gray-900">{itemCount} items</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">Total acumulado:</span>
                                    <span className="font-bold text-primary text-lg">{formatPrice(total)}</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <span>Agregar al pedido</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                {formatPrice(selectedProduct.price * quantity)}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
