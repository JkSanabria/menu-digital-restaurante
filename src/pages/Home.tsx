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
    const [showOffers, setShowOffers] = useState(false);
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
        <div className="container mx-auto px-4 py-6 max-w-md md:max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">

            {/* Search Bar */}
            <div className="relative mb-10 sticky top-6 z-50 mx-auto max-w-2xl px-2">
                <div className="relative group">
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 -z-10 transition-all duration-300 group-hover:shadow-xl group-hover:bg-white/90"></div>
                    <input
                        type="text"
                        placeholder="¿Qué se te antoja hoy?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-12 py-4 bg-transparent border-0 rounded-2xl text-gray-800 placeholder:text-gray-500 font-medium focus:ring-0 text-lg shadow-none"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Search className="text-primary/70" size={24} />
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {!searchTerm && (
                /* Ofertas Section - Toggleable */
                <div onClick={() => setShowOffers(!showOffers)} className="cursor-pointer block mb-8 relative group mx-2 md:mx-0 select-none transition-transform active:scale-[0.98]">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <div className="relative h-36 md:h-44 bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-between p-6 hover:-translate-y-1 transition-transform duration-300">
                        {/* Content */}
                        <div className="z-10 flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block py-1 px-2 rounded-lg bg-orange-500/20 text-orange-400 text-[10px] md:text-xs font-black tracking-widest uppercase border border-orange-500/30">
                                    ¡Oferta Flash!
                                </span>
                                <span className="animate-bounce">🔥</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-1 leading-none drop-shadow-xl">
                                HAPPY <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">HOUR</span>
                            </h2>
                            <p className="text-gray-400 text-xs md:text-sm font-medium">2x1 en Cocteles seleccionados • 4pm - 8pm</p>
                        </div>

                        {/* Image */}
                        <div className="absolute top-0 right-0 w-3/5 h-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/40 to-transparent z-10 block"></div>
                            <img
                                src="https://pacciolo-legal-autos.s3.us-east-1.amazonaws.com/imagenes_proyectos/Napoli_Bebidas.jpg"
                                className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay group-hover:mix-blend-normal"
                                alt="Oferta"
                            />
                        </div>

                        {/* Floating Toggle */}
                        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                            <div className={`bg-white text-black p-2 rounded-full shadow-lg transition-transform duration-300 ${showOffers ? 'rotate-45 bg-gray-100' : 'rotate-0'}`}>
                                <Plus size={20} className="stroke-[3]" />
                            </div>
                            {!showOffers && (
                                <div className="bg-white text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg -rotate-3 group-hover:rotate-0 transition-transform animate-in fade-in zoom-in border border-yellow-400">
                                    VER 30% OFF
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Promo Products Grid */}
            {!searchTerm && bebidasSection && showOffers && (
                <div className="mb-12 mx-2 md:mx-0 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    <div className="flex items-center justify-between mb-4 pl-1">
                        <div className="flex items-center gap-2">
                            <div className="bg-red-100 p-1.5 rounded-full">
                                <span className="text-xl leading-none">⚡</span>
                            </div>
                            <h3 className="font-heading text-xl font-black text-gray-900 tracking-tight">
                                Ofertas Relámpago
                            </h3>
                        </div>
                        <Link to="/section/bebidas" className="text-primary text-xs font-bold uppercase tracking-wider hover:underline bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
                            Ver todas
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {bebidasSection.subcategories.flatMap(s => s.categories).flatMap(c => c.products).slice(0, 4).map(product => {
                            const originalPrice = product.price;
                            const promoPrice = Math.floor(product.price * 0.7); // 30% off

                            return (
                                <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm border border-orange-100 relative group overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
                                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg z-10 shadow-sm transform -rotate-2 group-hover:rotate-0 transition-transform">
                                        AHORRA 30%
                                    </div>

                                    <div onClick={() => openModal({ ...product, price: promoPrice })} className="cursor-pointer mb-3">
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-50 relative">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                                        </div>
                                        <h4 className="font-heading font-bold text-sm text-gray-900 line-clamp-1 mb-1 leading-tight">{product.name}</h4>
                                        <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">Oferta por tiempo limitado</p>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-red-600 font-black text-lg">{formatPrice(promoPrice)}</span>
                                            <span className="text-xs text-gray-400 line-through font-medium Decoration-1">{formatPrice(originalPrice)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart({ ...product, price: promoPrice });
                                        }}
                                        className="w-full bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Plus size={16} strokeWidth={3} />
                                        AGREGAR
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {!searchTerm ? (
                /* Menu Sections - High Contrast Wide Grid */
                <nav className="grid grid-cols-2 gap-3 lg:gap-6" aria-label="Menú principal">
                    {/* Comidas Section */}
                    {comidasSection && (
                        <Link
                            to={`/section/${comidasSection.id}`}
                            className="group relative h-24 md:h-36 lg:h-40 rounded-xl overflow-hidden bg-black shadow-md border border-gray-800 hover:border-gray-600 transition-all active:scale-[0.98]"
                            aria-label="Ver menú de comidas"
                        >
                            <img
                                src={comidasSection.image}
                                alt=""
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-all duration-500 grayscale-[20%]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-heading text-xl md:text-3xl font-black tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300">
                                    {comidasSection.name}
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Bebidas Section */}
                    {bebidasSection && (
                        <Link
                            to={`/section/${bebidasSection.id}`}
                            className="group relative h-24 md:h-36 lg:h-40 rounded-xl overflow-hidden bg-black shadow-md border border-gray-800 hover:border-gray-600 transition-all active:scale-[0.98]"
                            aria-label="Ver menú de bebidas"
                        >
                            <img
                                src={bebidasSection.image}
                                alt=""
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-all duration-500 grayscale-[20%]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-heading text-xl md:text-3xl font-black tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300">
                                    {bebidasSection.name}
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Especialidades Section */}
                    {especialidadesSection && (
                        <Link
                            to={`/section/${especialidadesSection.id}`}
                            className="group relative h-24 md:h-36 lg:h-40 rounded-xl overflow-hidden bg-black shadow-md border border-gray-800 hover:border-gray-600 transition-all active:scale-[0.98]"
                            aria-label="Ver especialidades"
                        >
                            <img
                                src={especialidadesSection.image}
                                alt=""
                                className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-all duration-500 grayscale-[20%]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                                <span className="text-white font-heading text-lg md:text-2xl font-black tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300 leading-tight">
                                    {especialidadesSection.name}
                                </span>
                                <span className="text-gray-300 text-xs md:text-sm font-bold tracking-widest uppercase mt-1 opacity-80">de la Casa</span>
                            </div>
                        </Link>
                    )}

                    {/* Recomendaciones Section */}
                    {recomendacionesSection && (
                        <Link
                            to={`/section/${recomendacionesSection.id}`}
                            className="group relative h-24 md:h-36 lg:h-40 rounded-xl overflow-hidden bg-black shadow-md border border-gray-800 hover:border-gray-600 transition-all active:scale-[0.98]"
                            aria-label="Ver recomendaciones"
                        >
                            <img
                                src={recomendacionesSection.image}
                                alt=""
                                className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-all duration-500 grayscale-[20%]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
                                <span className="text-white font-heading text-lg md:text-2xl font-black tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300 leading-tight">
                                    {recomendacionesSection.name}
                                </span>
                                <span className="text-gray-300 text-xs md:text-sm font-bold tracking-widest uppercase mt-1 opacity-80">del Chef</span>
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
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {matchedSections.map(section => (
                                    <Link
                                        key={section.id}
                                        to={`/section/${section.id}`}
                                        className="group relative h-14 md:h-20 lg:h-24 rounded-lg overflow-hidden bg-gray-900 shadow-sm border border-gray-100/50 hover:border-primary transition-all active:scale-[0.98]"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {matchedProducts.map(product => {
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
                                            <div className="text-gray-400 group-hover:text-primary transition-all p-1 rounded-full hover:bg-orange-50 ml-1" title="Ver detalle">
                                                <span className="sr-only">Ver detalle</span>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
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
                            }
                        </div>
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
