import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, X, Plus, Minus } from 'lucide-react';
import menuData from '../data/menu.json';
import { MenuData, Product } from '../types/menu';
import { useCart } from '../context/CartContext';

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

export default function Home() {
    const { itemCount, total, addToCart, updateQuantity, items } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);

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

    // Search Logic
    const { matchedProducts, matchedSections } = useMemo(() => {
        if (!searchTerm.trim()) return { matchedProducts: [], matchedSections: [] };
        const term = searchTerm.toLowerCase();

        // Search Sections First
        const sections = data.filter(section =>
            section.name.toLowerCase().includes(term)
        );

        // Map of matched section IDs for efficient lookup
        const matchedSectionIds = new Set(sections.map(s => s.id));

        const products: Product[] = [];

        data.forEach(section => {
            const isSectionMatch = matchedSectionIds.has(section.id);

            section.subcategories.forEach(sub => {
                const isSubMatch = sub.name.toLowerCase().includes(term);

                sub.categories.forEach(cat => {
                    const isCatMatch = cat.name.toLowerCase().includes(term);

                    cat.products.forEach(prod => {
                        const isDirectMatch = prod.name.toLowerCase().includes(term) || prod.description.toLowerCase().includes(term);

                        if (isDirectMatch || isSectionMatch || isSubMatch || isCatMatch) {
                            products.push(prod);
                        }
                    });
                });
            });
        });

        // Remove duplicates if any (though logic ensures unique iteration)
        return { matchedProducts: products, matchedSections: sections };
    }, [searchTerm]);

    // Extract sections with proper null handling
    // Extract sections with proper null handling
    const comidasSection = data.find(section => section.id === 'comidas');
    const bebidasSection = data.find(section => section.id === 'bebidas');
    const especialidadesSection = data.find(section => section.id === 'especialidades');
    const recomendacionesSection = data.find(section => section.id === 'recomendaciones');

    return (
        <div className="container mx-auto px-4 py-6 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">

            {/* Search Bar */}
            <div className="relative mb-6 sticky top-2 z-40">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="¿Qué se te antoja hoy?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 placeholder:text-gray-400 bg-white/95 backdrop-blur"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {!searchTerm ? (
                /* Menu Sections - Ultra Compact Grid */
                <nav className="grid grid-cols-2 gap-3" aria-label="Menú principal">
                    {/* Comidas Section */}
                    {comidasSection && (
                        <Link
                            to={`/section/${comidasSection.id}`}
                            className="group relative h-16 rounded-lg overflow-hidden bg-gray-900 shadow-sm border border-gray-100/50 hover:border-gray-200 transition-all active:scale-[0.98]"
                            aria-label="Ver menú de comidas"
                        >
                            <img
                                src={comidasSection.image}
                                alt=""
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-all duration-300 grayscale-[20%]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-heading text-xl font-bold tracking-wider uppercase drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    {comidasSection.name}
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Bebidas Section */}
                    {bebidasSection && (
                        <Link
                            to={`/section/${bebidasSection.id}`}
                            className="group relative h-16 rounded-lg overflow-hidden bg-gray-900 shadow-sm border border-gray-100/50 hover:border-gray-200 transition-all active:scale-[0.98]"
                            aria-label="Ver menú de bebidas"
                        >
                            <img
                                src={bebidasSection.image}
                                alt=""
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-all duration-300 grayscale-[20%]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-heading text-xl font-bold tracking-wider uppercase drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    {bebidasSection.name}
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Especialidades Section */}
                    {especialidadesSection && (
                        <Link
                            to={`/section/${especialidadesSection.id}`}
                            className="group relative h-16 rounded-lg overflow-hidden bg-gray-900 shadow-sm border border-gray-100/50 hover:border-gray-200 transition-all active:scale-[0.98]"
                            aria-label="Ver especialidades"
                        >
                            <img
                                src={especialidadesSection.image}
                                alt=""
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-all duration-300 grayscale-[20%]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-center px-1">
                                <span className="text-white font-heading text-sm font-bold tracking-wider uppercase drop-shadow-lg group-hover:scale-105 transition-transform duration-300 leading-tight">
                                    {especialidadesSection.name} de la Casa
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Recomendaciones Section */}
                    {recomendacionesSection && (
                        <Link
                            to={`/section/${recomendacionesSection.id}`}
                            className="group relative h-16 rounded-lg overflow-hidden bg-gray-900 shadow-sm border border-gray-100/50 hover:border-gray-200 transition-all active:scale-[0.98]"
                            aria-label="Ver recomendaciones"
                        >
                            <img
                                src={recomendacionesSection.image}
                                alt=""
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-all duration-300 grayscale-[20%]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-center px-1">
                                <span className="text-white font-heading text-sm font-bold tracking-wider uppercase drop-shadow-lg group-hover:scale-105 transition-transform duration-300 leading-tight">
                                    {recomendacionesSection.name} del Chef
                                </span>
                            </div>
                        </Link>
                    )}
                </nav>
            ) : (
                /* Search Results */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Sections Results */}
                    {matchedSections.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                                Secciones ({matchedSections.length})
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {matchedSections.map(section => (
                                    <Link
                                        key={section.id}
                                        to={`/section/${section.id}`}
                                        className="group relative h-14 rounded-lg overflow-hidden bg-gray-900 shadow-sm border border-gray-100/50 hover:border-primary transition-all active:scale-[0.98]"
                                    >
                                        <img
                                            src={section.image}
                                            alt=""
                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-all duration-300 grayscale-[20%]"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white font-heading text-xs font-bold tracking-wider uppercase drop-shadow-md text-center px-1 leading-tight">
                                                {section.name}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products Results Header */}
                    {matchedProducts.length > 0 && (
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                            Productos ({matchedProducts.length})
                        </p>
                    )}

                    {matchedSections.length === 0 && matchedProducts.length === 0 ? (
                        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                            <p className="text-gray-500 font-medium">No encontramos "{searchTerm}"</p>
                            <button onClick={() => setSearchTerm('')} className="text-primary text-sm font-bold mt-2 hover:underline">
                                Ver todo el menú
                            </button>
                        </div>
                    ) : (
                        matchedProducts.map(product => {
                            const cartItem = items.find(item => item.id === product.id);
                            const itemQuantity = cartItem ? cartItem.quantity : 0;

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
                                        <div className="text-gray-300 group-hover:text-primary/50 transition-colors">
                                            <span className="sr-only">Ver detalle</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="font-bold text-base text-primary whitespace-nowrap">
                                            {formatPrice(product.price)}
                                        </span>

                                        {itemQuantity > 0 ? (
                                            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(product.id, itemQuantity - 1);
                                                    }}
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-red-500 active:scale-95 transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-sm text-gray-800">{itemQuantity}</span>
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
                        })
                    )}
                </div>
            )}

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

            {/* Floating Cart Button */}
            {itemCount > 0 && (
                <div className="fixed bottom-4 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
                    <Link
                        to="/cart"
                        className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-3 transition-all active:scale-[0.98] animate-in slide-in-from-bottom-4 pointer-events-auto border border-white/20 backdrop-blur-sm bg-opacity-95"
                    >
                        <div className="relative">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-primary">
                                {itemCount}
                            </span>
                        </div>
                        <span>Ver Carrito ({formatPrice(total)})</span>
                    </Link>
                </div>
            )}


        </div>
    );
}
