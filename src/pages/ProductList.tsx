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
    const { addToCart, total, items } = useCart();
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
                <div className="mb-6">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider bg-orange-100 px-2 py-1 rounded">
                        {section.name}
                    </span>
                    <h1 className="text-3xl font-heading text-gray-900 mt-2">{subcategory.name}</h1>
                </div>

                <div className="flex flex-col gap-8">
                    {subcategory.categories.map((category) => (
                        <div key={category.id} className="scroll-mt-20" id={category.id}>
                            <h2 className="text-xl font-bold text-primary mb-4 border-b-2 border-primary/10 pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent block"></span>
                                {category.name}
                            </h2>

                            <div className="grid gap-4">
                                {category.products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => openModal(product)}
                                        className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md active:scale-[0.99] relative overflow-hidden cursor-pointer"
                                    >
                                        {/* Image Placeholder or Actual Image */}
                                        <div className="w-24 h-24 shrink-0 rounded-lg bg-gray-100 overflow-hidden relative">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-1 justify-between py-1 relative z-10">
                                            <div>
                                                <h3 className="font-heading text-lg text-gray-800 leading-tight mb-1 group-hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-10 overflow-hidden">
                                                    {product.description}
                                                </p>

                                                {/* Additional Info */}
                                                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                                                    {product.prepTime && (
                                                        <span className="flex items-center gap-1">
                                                            ⏱️ {product.prepTime}
                                                        </span>
                                                    )}
                                                    {product.spiceLevel !== undefined && product.spiceLevel > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            {'🌶️'.repeat(product.spiceLevel)}
                                                        </span>
                                                    )}
                                                    {product.size && (
                                                        <span className="flex items-center gap-1">
                                                            📏 {product.size}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Badges */}
                                            {product.attributes.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {product.attributes.includes('recomendado') && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-semibold">⭐ Recomendado</span>
                                                    )}
                                                    {product.attributes.includes('favorito-chef') && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">👨‍🍳 Chef</span>
                                                    )}
                                                    {product.attributes.includes('nuevo') && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">🆕 Nuevo</span>
                                                    )}
                                                    {product.attributes.includes('vegetariano') && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-organic/20 text-organic font-semibold">🥗 Vegetariano</span>
                                                    )}
                                                    {product.attributes.includes('picante') && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">🌶️ Picante</span>
                                                    )}
                                                    {product.attributes.includes('para-compartir') && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-semibold">👥 Compartir</span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex justify-between items-end mt-2">
                                                <span className="font-bold text-lg text-primary">
                                                    {formatPrice(product.price)}
                                                </span>

                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                                                    aria-label="Agregar al carrito"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
