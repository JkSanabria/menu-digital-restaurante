import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, X, Plus, Minus } from 'lucide-react';
import menuData from '../data/menu.json';
import { MenuData, Product } from '../types/menu';
import { useCart } from '../context/CartContext';
import { matchesSearch } from '../utils/searchUtils';

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
    const [productNote, setProductNote] = useState('');

    // Search Logic
    const { matchedProducts, matchedSections } = useMemo(() => {
        if (!searchTerm.trim()) return { matchedProducts: [], matchedSections: [] };
        const term = searchTerm.toLowerCase();

        // Search Sections First
        const sections = data.filter(section =>
            matchesSearch(section.name, term)
        );

        // Map of matched section IDs for efficient lookup
        const matchedSectionIds = new Set(sections.map(s => s.id));

        const products: Product[] = [];

        data.forEach(section => {
            const isSectionMatch = matchedSectionIds.has(section.id);

            section.subcategories.forEach(sub => {
                const isSubMatch = matchesSearch(sub.name, term);

                sub.categories.forEach(cat => {
                    const isCatMatch = matchesSearch(cat.name, term);

                    cat.products.forEach(prod => {
                        const isDirectMatch = matchesSearch(prod.name, term) || matchesSearch(prod.description, term);

                        if (isDirectMatch || isSectionMatch || isSubMatch || isCatMatch) {
                            products.push(prod);
                        }
                    });
                });
            });
        });

        // Deduplicate products by ID to allow same product in multiple categories without UI dupes
        const uniqueProducts = Array.from(new Map(products.map(item => [item.id, item])).values());

        return { matchedProducts: uniqueProducts, matchedSections: sections };
    }, [searchTerm]);

    // Extract sections with proper null handling
    const comidasSection = data.find(section => section.id === 'comidas');
    const bebidasSection = data.find(section => section.id === 'bebidas');
    const especialidadesSection = data.find(section => section.id === 'especialidades');
    const pizzasSection = data.find(section => section.id === 'pizzas');
    const entradasSection = data.find(section => section.id === 'entradas');
    const postresSection = data.find(section => section.id === 'postres');

    // Modal Option Logic
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');

    // Reset options when opening modal
    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setSelectedOptions([]);
        setProductNote('');

        // Auto-select first size if available
        if (product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        } else {
            setSelectedSize('');
        }
    };

    const toggleOption = (option: string, max: number) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(prev => prev.filter(o => o !== option));
        } else {
            if (selectedOptions.length < max) {
                setSelectedOptions(prev => [...prev, option]);
            }
        }
    };

    const handleAddToCart = () => {
        if (!selectedProduct) return;

        // Clone product to avoid mutating original data
        const productToAdd = { ...selectedProduct };
        let uniqueIdSuffix = '';

        // Handle Size Logic
        if (selectedSize && productToAdd.sizePrices) {
            productToAdd.size = selectedSize;
            productToAdd.price = productToAdd.sizePrices[selectedSize];
            uniqueIdSuffix += `-${selectedSize}`;
            productToAdd.name = `${productToAdd.name} (${selectedSize})`;
        }

        // Handle Options Logic (e.g. for Combined Pizzas)
        if (selectedOptions.length > 0) {
            const optionsKey = selectedOptions.sort().join('-');
            uniqueIdSuffix += `-${optionsKey}`;

            // Append options directly to name for simple cart display
            if (selectedSize) {
                productToAdd.name = `${productToAdd.name} - ${selectedOptions.join(' / ')}`;
            } else {
                productToAdd.name = `${productToAdd.name} (${selectedOptions.join(' / ')})`;
            }

            productToAdd.attributes = [...(productToAdd.attributes || []), ...selectedOptions];
        }

        // Apply unique ID
        if (uniqueIdSuffix) {
            productToAdd.id = `${productToAdd.id}${uniqueIdSuffix}`;
        }

        // Add the product multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(productToAdd, productNote);
        }

        // Reset modal
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedOptions([]);
        setSelectedSize('');
        setProductNote('');
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedOptions([]);
        setSelectedSize('');
        setProductNote('');
    };

    // Calculate current display price based on size selection
    const currentPrice = selectedProduct?.sizePrices && selectedSize
        ? selectedProduct.sizePrices[selectedSize]
        : selectedProduct?.price || 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-white">
            <div className="container mx-auto px-4 py-6 max-w-md md:max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">

            {/* Search Bar - Enhanced Visibility */}
            <div className="relative mb-10 sticky top-6 z-50 mx-auto max-w-2xl px-2">
                <div className="relative group">
                    {/* Animated gradient border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-orange-400 to-primary rounded-2xl opacity-30 group-hover:opacity-50 blur-sm transition-all duration-300 animate-pulse"></div>

                    <div className="relative bg-white rounded-2xl shadow-xl border-2 border-primary/30 group-hover:border-primary/50 transition-all duration-300">
                        <input
                            type="text"
                            placeholder="🔍 Busca tu platillo favorito... (ej: Jamón, Jamon)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-14 pr-12 py-5 bg-transparent border-0 rounded-2xl text-gray-800 placeholder:text-gray-500 font-medium focus:ring-2 focus:ring-primary/30 text-lg"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Search className="text-primary animate-pulse" size={24} strokeWidth={2.5} />
                        </div>
                        {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-95"
                                >
                                    <X size={20} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Ofertas Section Hidden */}



            {!searchTerm ? (
                <>
                    {/* Menu Sections - High Contrast Wide Grid */}
                    <nav className="grid grid-cols-2 gap-4 lg:gap-6" aria-label="Menú principal">
                        {[
                            { section: comidasSection, path: `/section/${comidasSection?.id}`, label: '' },
                            { section: bebidasSection, path: `/section/${bebidasSection?.id}`, label: '' },
                            { section: especialidadesSection, path: `/section/${especialidadesSection?.id}`, label: 'de la Casa' },
                            { section: pizzasSection, path: '/pizzas', label: 'Combínalas a tu gusto' }, // Custom path for Pizzas
                            { section: entradasSection, path: `/section/${entradasSection?.id}`, label: '' },
                            { section: postresSection, path: `/section/${postresSection?.id}`, label: '' }
                        ].map(({ section, path, label }) => {
                            if (!section) return null;
                            return (
                                <Link
                                    key={section.id}
                                    to={path}
                                    className="group relative h-24 md:h-32 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 active:scale-[0.98]"
                                >
                                    <img
                                        src={section.image}
                                        alt=""
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                                        loading="lazy"
                                    />
                                    {/* Stronger Gradient for Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10">
                                        <span className="text-white font-heading text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg leading-none mb-1 group-hover:-translate-y-1 transition-transform duration-300">
                                            {section.name}
                                        </span>
                                        {label && (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-semibold uppercase tracking-widest bg-black/40 text-orange-100 border border-white/15 backdrop-blur-sm group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                                                {label}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-4">
                        <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50 to-red-50 px-5 py-4 text-center shadow-md">
                            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-100/70 blur-2xl"></div>
                            <div className="relative flex items-center justify-center gap-4 text-base md:text-lg font-bold text-gray-800">
                                <span className="text-xl md:text-2xl animate-bounce">🎉</span>
                                <span className="drop-shadow-sm">🏍️ Domicilio GRATIS al pedir por esta APP. ¡Ordena Ahora! 🍕🔥</span>
                                <span className="text-xl md:text-2xl">🚚</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Search Results */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Sections Results */}
                    {matchedSections.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                                Secciones ({matchedSections.length})
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {matchedSections.map(section => (
                                    <Link
                                        key={section.id}
                                        to={`/section/${section.id}`}
                                        className="group relative h-14 md:h-20 lg:h-24 rounded-xl overflow-hidden bg-gray-900 shadow-sm border border-gray-100 hover:border-primary transition-all active:scale-[0.98]"
                                    >
                                        <img
                                            src={section.image}
                                            alt=""
                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-all duration-300 grayscale-[20%]"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white font-heading text-sm md:text-base font-bold tracking-tight drop-shadow-md text-center px-1 leading-tight">
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
                        <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                            Productos ({matchedProducts.length})
                        </p>
                    )}

                    {matchedSections.length === 0 && matchedProducts.length === 0 ? (
                        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                            <p className="text-gray-500 font-medium">No encontramos "{searchTerm}"</p>
                            <button onClick={() => setSearchTerm('')} className="min-h-[44px] px-3 py-2 rounded-full text-primary text-sm font-bold hover:bg-primary/10 transition-all active:scale-[0.98]">
                                Ver todo el menú
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matchedProducts.map(product => {
                                const cartItem = items.find(item => item.lineId === product.id);
                                const itemQuantity = cartItem ? cartItem.quantity : 0;

                                return (
                                    <div
                                        key={product.id}
                                        className="group bg-white rounded-xl py-2 px-3 shadow-sm border border-gray-100 flex items-center justify-between gap-4 transition-all hover:border-primary/30 hover:shadow-md active:bg-gray-50"
                                    >
                                        <div
                                            onClick={() => openModal(product)}
                                            className="flex-1 cursor-pointer flex items-center gap-4"
                                        >
                                            <h3 className="font-heading text-base font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="text-gray-400 group-hover:text-primary transition-all p-1 rounded-full hover:bg-orange-50 ml-1" title="Ver detalle">
                                                <span className="sr-only">Ver detalle</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="font-bold text-base text-primary whitespace-nowrap">
                                                {formatPrice(product.price)}
                                            </span>

                                            {itemQuantity > 0 ? (
                                                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateQuantity(product.id, itemQuantity - 1);
                                                        }}
                                                        className="w-11 h-11 flex items-center justify-center bg-white rounded-xl text-gray-600 shadow-sm hover:text-red-500 active:scale-95 transition-all"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-sm text-gray-800">{itemQuantity}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product);
                                                        }}
                                                        className="w-11 h-11 flex items-center justify-center bg-primary text-white rounded-xl shadow-sm hover:bg-red-700 active:scale-95 transition-all"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToCart(product);
                                                    }}
                                                    className="w-11 h-11 rounded-full bg-gray-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100 active:scale-95"
                                                    aria-label="Agregar al carrito"
                                                >
                                                    <Plus size={20} />
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
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in slide-in-from-bottom-8 duration-300 sm:slide-in-from-bottom-0 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                            <div className="flex-1 pr-4">
                                <h3 className="font-heading text-2xl text-gray-900 leading-tight mb-1">
                                    {selectedProduct.name}
                                </h3>
                                <p className="text-sm text-gray-500">{selectedProduct.description}</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="h-11 w-11 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                        {selectedProduct.image && (
                            <div className="rounded-xl overflow-hidden aspect-video shadow-md border border-gray-100">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}

                        {/* Size Selection */}
                        {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">Tamaño</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {selectedProduct.sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`
                                                py-2 px-3 rounded-xl text-sm font-bold border-2 transition-all
                                                ${selectedSize === size
                                                    ? 'border-primary bg-primary text-white shadow-md transform scale-[1.02]'
                                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'}
                                            `}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Options Selection (Checkbox List) */}
                        {selectedProduct.options && selectedProduct.maxOptions && (
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2 flex justify-between items-center">
                                    <span>Elige tus sabores</span>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-semibold border border-orange-200 bg-orange-100 text-orange-700">
                                        {selectedOptions.length}/{selectedProduct.maxOptions} seleccionados
                                    </span>
                                </h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {selectedProduct.options.map(option => {
                                        const isSelected = selectedOptions.includes(option);
                                        const isDisabled = !isSelected && selectedOptions.length >= (selectedProduct.maxOptions || 0);

                                        return (
                                            <div
                                                key={option}
                                                onClick={() => !isDisabled && toggleOption(option, selectedProduct.maxOptions || 0)}
                                                className={`
                                                    flex items-center p-3 rounded-xl border cursor-pointer transition-all
                                                    ${isSelected ? 'border-primary bg-red-50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}
                                                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors
                                                    ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}
                                                `}>
                                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                                                    {option}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {selectedOptions.length < (selectedProduct.maxOptions || 0) && (
                                    <p className="text-xs text-orange-600 mt-2 font-medium animate-pulse">
                                        * Debes elegir {selectedProduct.maxOptions} sabores para continuar
                                    </p>
                                )}
                            </div>
                        )}

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Observaciones</label>
                                <textarea
                                    value={productNote}
                                    onChange={(e) => setProductNote(e.target.value)}
                                    placeholder="Ej: sin cebolla, sin tomate, poco picante"
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary resize-none h-20"
                                />
                            </div>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                            <span className="text-gray-600 font-medium">Cantidad</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-11 h-11 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors active:scale-95"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-11 h-11 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors active:scale-95"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Precio unitario</span>
                            <span className="font-bold text-lg text-gray-900">{formatPrice(currentPrice)}</span>
                        </div>

                        {/* Current Cart Summary */}
                        {itemCount > 0 && (
                            <div className="bg-gradient-to-r from-primary/10 to-orange-50 p-4 rounded-xl border border-primary/20">
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
                        </div>

                        <div className="p-6 border-t border-gray-100">
                            <button
                                onClick={handleAddToCart}
                                disabled={selectedProduct.maxOptions ? selectedOptions.length !== selectedProduct.maxOptions : false}
                                className={`
                                w-full min-h-[44px] px-4 py-3 rounded-xl font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed
                                    ${selectedProduct.maxOptions && selectedOptions.length !== selectedProduct.maxOptions
                                        ? 'bg-gray-300 text-gray-500'
                                        : 'bg-primary hover:bg-red-700 text-white'}
                                `}
                            >
                                <span>
                                    {selectedProduct.maxOptions && selectedOptions.length !== selectedProduct.maxOptions
                                        ? `Elige ${selectedProduct.maxOptions - selectedOptions.length} más`
                                        : 'Agregar al pedido'}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm ${selectedProduct.maxOptions && selectedOptions.length !== selectedProduct.maxOptions ? 'bg-gray-400/20' : 'bg-white/20'}`}>
                                    {formatPrice(currentPrice * quantity)}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Cart Button */}
            {itemCount > 0 && (
                <div className="fixed bottom-4 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
                    <Link
                        to="/cart"
                        className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-4 transition-all active:scale-[0.98] animate-in slide-in-from-bottom-4 pointer-events-auto border border-white/20 backdrop-blur-sm bg-opacity-95"
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
        </div>
    );
}
