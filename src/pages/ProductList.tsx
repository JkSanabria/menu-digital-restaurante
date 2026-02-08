import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import menuData from '../data/menu.json';
import { MenuData, Product } from '../types/menu';
import { useCart } from '../context/CartContext';
import { Plus, Minus, X } from 'lucide-react';

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
            <div className="container mx-auto px-4 py-6 max-w-lg animate-in fade-in slide-in-from-right-8 duration-300 pb-32">
                {/* Header Compacto Alineado */}
                <div className="flex items-baseline gap-3 mb-4 border-b border-primary/20 pb-2">
                    <h1 className="text-2xl font-heading font-bold text-gray-900">{subcategory.name}</h1>
                    <span className="text-xs font-bold text-primary/60 uppercase tracking-wider font-light">
                        {section.name}
                    </span>
                </div>

                <div className="flex flex-col gap-8">
                    {subcategory.categories.map((category) => (
                        <div key={category.id} className="scroll-mt-20" id={category.id}>
                            {/* Titulo de categoria eliminado como se solicito */}

                            <div className="grid gap-4">
                                {category.products.map((product) => {
                                    const cartItem = items.find(item => item.id === product.id);
                                    const quantity = cartItem ? cartItem.quantity : 0;

                                    return (
                                        <div
                                            key={product.id}
                                            className="group bg-white rounded-lg py-2 px-3 shadow-sm border border-gray-100 flex items-center justify-between gap-3 transition-all hover:border-primary/30 hover:shadow-md active:bg-gray-50"
                                        >
                                            <div
                                                onClick={() => openModal(product)}
                                                className="flex-1 cursor-pointer flex items-center gap-2"
                                            >
                                                <h3 className="font-heading text-base font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                                {/* Visual affordance for details */}
                                                <div className="text-gray-300 group-hover:text-primary/50 transition-colors">
                                                    <span className="sr-only">Ver detalle</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="font-bold text-base text-primary whitespace-nowrap">
                                                    {formatPrice(product.price)}
                                                </span>

                                                {quantity > 0 ? (
                                                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateQuantity(product.id, quantity - 1);
                                                            }}
                                                            className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-red-500 active:scale-95 transition-all"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-sm text-gray-800">{quantity}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(product);
                                                            }}
                                                            className="w-7 h-7 flex items-center justify-center bg-primary text-white rounded-md shadow-sm hover:bg-red-700 active:scale-95 transition-all"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product);
                                                        }}
                                                        className="w-8 h-8 rounded-full bg-gray-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100 active:scale-90"
                                                        aria-label="Agregar al carrito"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
