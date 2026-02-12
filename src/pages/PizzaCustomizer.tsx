
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Minus, X, Spline, ArrowLeft, GitMerge, Search, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import menuData from '../data/menu.json';
import { MenuData, Product } from '../types/menu';
import PizzaBuilderModal from './PizzaBuilder';
import { matchesSearch } from '../utils/searchUtils';

const data: MenuData = menuData as unknown as MenuData;

// Type definitions
type PizzaSize = 'Personal' | 'Mediana' | 'Familiar';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function PizzaMenu() {
    const navigate = useNavigate();
    const { addToCart, updateQuantity, items, replaceCartItem } = useCart();

    // State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<PizzaSize>('Mediana');
    const [quantity, setQuantity] = useState(1);
    const [productNote, setProductNote] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Builder State
    const [showBuilder, setShowBuilder] = useState(false);
    const [builderInitialFlavor, setBuilderInitialFlavor] = useState<Product | undefined>(undefined);
    const [builderInitialFlavors, setBuilderInitialFlavors] = useState<Product[] | undefined>(undefined);
    const [builderInitialSize, setBuilderInitialSize] = useState<PizzaSize | undefined>(undefined);
    const [builderInitialQuantity, setBuilderInitialQuantity] = useState<number | undefined>(undefined);
    const [builderEditingLineId, setBuilderEditingLineId] = useState<string | undefined>(undefined);

    const [editingLineId, setEditingLineId] = useState<string | null>(null);

    // Data Extraction
    const pizzaSection = data.find(s => s.id === 'pizzas');
    // Get all traditional pizzas flat list
    const allTraditionalPizzas = pizzaSection?.subcategories.find(s => s.id === 'pizzas-tradicionales')?.categories.flatMap(c => c.products) || [];

    // Filter pizzas based on search query with enhanced matching
    const traditionalPizzas = allTraditionalPizzas.filter(pizza =>
        matchesSearch(pizza.name, searchQuery)
    );

    // Get Active Pizzas from Cart (Combined + Traditional)
    // Create a Set of base IDs for fast lookup, but we need to check startsWith for variants
    const traditionalPizzaIds = allTraditionalPizzas.map(p => p.id);

    const userPizzas = items.filter(item => {
        // 1. Combined pizzas
        if (item.id.startsWith('custom-pizza-combined-')) return true;

        // 2. Traditional pizzas (ID format: "{baseId}-{Size}")
        // We match if the item ID starts with any traditional pizza ID followed by a dash
        // This handles IDs with dashes correctly (e.g. "pizza-hawaiana-Mediana" starts with "pizza-hawaiana-")
        return traditionalPizzaIds.some(baseId => item.id.startsWith(`${baseId}-`));
    });

    const isCombinedProduct = (product?: Product | null) => Boolean(
        product?.id?.startsWith('custom-pizza-combined-') ||
        product?.description === 'Mitad y Mitad' ||
        product?.name?.toLowerCase().includes('combinada')
    );

    const getCombinedTitle = (product: Product) => {
        const flavors = (product.attributes || []).filter(Boolean);
        if (flavors.length >= 2) {
            return `Combinada: ${flavors.join(' / ')}`;
        }

        const name = product.name || '';
        const match = name.match(/:\s*(.+)$/i);
        if (match?.[1]) {
            return `Combinada: ${match[1].trim()}`;
        }

        const cleanedName = name.replace(/combinada\s*/i, '').trim();
        return `Combinada: ${cleanedName || name}`;
    };

    const isCombinedSelection = isCombinedProduct(selectedProduct);

    const sizeOptions: PizzaSize[] = isCombinedSelection
        ? ['Mediana', 'Familiar']
        : ['Personal', 'Mediana', 'Familiar'];

    useEffect(() => {
        if (selectedProduct && isCombinedSelection && selectedSize === 'Personal') {
            setSelectedSize('Mediana');
        }
    }, [selectedProduct, isCombinedSelection, selectedSize]);

    // Calculate dynamic price based on size for Modal
    const currentPrice = selectedProduct
        ? (selectedProduct.sizePrices?.[selectedSize] || selectedProduct.price)
        : 0;

    const handleAddToCart = () => {
        if (!selectedProduct) return;

        // Create specific product variant based on size
        const uniqueId = `${selectedProduct.id}-${selectedSize}`;

        // Ensure name includes size cleanly
        // If name already has size (unlikely from JSON but possible in cart), don't add it again.
        // Base products don't have size in name usually.
        const finalName = `${selectedProduct.name} (${selectedSize})`;

        const productToAdd: Product = {
            ...selectedProduct,
            id: uniqueId,
            name: finalName,
            price: currentPrice,
            size: selectedSize,
        };

        if (editingLineId) {
            replaceCartItem(editingLineId, productToAdd, productNote, quantity);
        } else {
            for (let i = 0; i < quantity; i++) {
                addToCart(productToAdd, productNote);
            }
        }

        // Close modal
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedSize('Mediana');
        setProductNote('');
        setEditingLineId(null);
    };

    const handleMix = () => {
        if (!selectedProduct) return;
        setBuilderInitialFlavor(selectedProduct);
        setBuilderInitialFlavors(undefined);
        setBuilderInitialSize(selectedSize);
        setBuilderInitialQuantity(quantity);
        setBuilderEditingLineId(undefined);
        setSelectedProduct(null); // Close traditional modal
        setShowBuilder(true); // Open builder modal
    }

    const openModal = (product: Product) => {
        setBuilderInitialFlavor(undefined); // Reset specific start flavor
        setBuilderInitialFlavors(undefined);
        setBuilderInitialSize(undefined);
        setBuilderInitialQuantity(undefined);
        setBuilderEditingLineId(undefined);
        setSelectedProduct(product);
        const productSize = product.size as PizzaSize | undefined;
        const isCombined = isCombinedProduct(product);
        const allowedSizes: PizzaSize[] = isCombined
            ? ['Mediana', 'Familiar']
            : ['Personal', 'Mediana', 'Familiar'];
        const nextSize = productSize && allowedSizes.includes(productSize)
            ? productSize
            : 'Mediana';
        setSelectedSize(nextSize);
        setQuantity(1);
        setProductNote('');
        setEditingLineId(null);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedSize('Mediana');
        setProductNote('');
        setEditingLineId(null);
    };

    const handleEditCombined = (product: Product, lineId: string, itemQuantity: number) => {
        const flavorNames = (product.attributes || []).filter(Boolean);
        const initialFlavors = allTraditionalPizzas.filter(p => flavorNames.includes(p.name));

        setBuilderInitialFlavor(undefined);
        setBuilderInitialFlavors(initialFlavors);
        setBuilderInitialSize(product.size as PizzaSize | undefined);
        setBuilderInitialQuantity(itemQuantity);
        setBuilderEditingLineId(lineId);
        setSelectedProduct(null);
        setShowBuilder(true);
    };

    const handleEditTraditional = (product: Product, lineId: string, itemQuantity: number, note?: string) => {
        const sizeOptions = ['Personal', 'Mediana', 'Familiar'];
        const baseProduct = allTraditionalPizzas.find(p =>
            sizeOptions.some(size => product.id === `${p.id}-${size}`)
        ) || product;

        openModal(baseProduct);
        setEditingLineId(lineId);
        setQuantity(itemQuantity);
        setSelectedSize((product.size as PizzaSize) || 'Mediana');
        setProductNote(note || '');
    };

    const closeBuilderModal = (reason?: 'cancel' | 'success') => {
        const initialFlavor = builderInitialFlavor;
        setShowBuilder(false);
        setBuilderInitialFlavor(undefined);
        setBuilderInitialFlavors(undefined);
        setBuilderInitialSize(undefined);
        setBuilderInitialQuantity(undefined);
        setBuilderEditingLineId(undefined);
        if (reason === 'cancel' && initialFlavor) {
            openModal(initialFlavor);
        }
    };

    // ------------------------------------------------------------------
    // RENDERERS
    // ------------------------------------------------------------------

    // 1. List Item for "Tus Pizzas Seleccionadas" (Minimalist, No Image)
    const renderSelectedPizzaItem = (product: Product) => {
        const itemQuantity = (product as any).quantity || 1;
        const lineId = (product as any).lineId || product.id;
        const note = (product as any).note as string | undefined;
        const combined = isCombinedProduct(product);

        return (
            <div key={lineId} className="flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-bottom-1">
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                        {product.name.replace('Pizza Combinada', 'Combinada')}
                    </span>
                    {/* Size Badge */}
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                        {product.size || 'Único'}
                    </span>
                    <button
                        onClick={() => combined
                            ? handleEditCombined(product, lineId, itemQuantity)
                            : handleEditTraditional(product, lineId, itemQuantity, note)
                        }
                        className="mt-1 text-xs font-bold text-primary hover:underline w-fit"
                    >
                        Cambia sabor o tamaño
                    </button>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-semibold text-gray-900 text-sm hidden sm:block w-20 text-right">
                        {formatPrice(product.price * itemQuantity)}
                    </span>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                        <button
                            onClick={() => updateQuantity(lineId, itemQuantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded-l-lg transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-gray-800 tabular-nums">
                            {itemQuantity}
                        </span>
                        <button
                            onClick={() => addToCart(product)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. List Item for "Catálogo" (Compact List Style, No Image)
    const renderCatalogItem = (product: Product) => {
        return (
            <div
                key={product.id}
                onClick={() => openModal(product)}
                className="group flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all active:bg-gray-100"
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h4 className="font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                    </h4>
                    {/* Optional: Minimal description if needed, or hide as requested */}
                    {/* <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p> */}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                        <span className="block text-xs text-gray-400 font-medium">Desde</span>
                        <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                    </div>

                    <button
                        className="w-8 h-8 rounded-full bg-gray-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100 mb-6">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="p-2 md:p-3 lg:p-4 -ml-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-primary transition-all active:scale-95">
                        <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    </button>
                    <h1 className="font-heading text-xl font-bold text-gray-900">Menú de Pizzas</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="shrink-0 inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-full border border-primary/20 bg-white text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
                        aria-label="Ir al menú principal"
                    >
                        <Home className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                        <span className="text-xs md:text-sm font-bold">Inicio</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl">

                {/* SECTION 1: Tus Pizzas Seleccionadas */}
                {userPizzas.length > 0 && (
                    <div className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-heading text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                Tus Pizzas Seleccionadas
                                <span className="bg-primary text-white text-[10px] px-1.5 rounded-full">{userPizzas.reduce((acc, p) => acc + ((p as any).quantity || 1), 0)}</span>
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {userPizzas.map(product => renderSelectedPizzaItem(product))}
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
                            <button
                                onClick={() => navigate('/cart')}
                                className="text-sm font-bold text-primary hover:underline"
                            >
                                Ir a Pagar ({formatPrice(userPizzas.reduce((acc, p) => acc + (p.price * ((p as any).quantity || 1)), 0))})
                            </button>
                        </div>
                    </div>
                )}


                {/* SECTION 2: Catálogo de Pizzas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    {/* Special Item: Combinar */}
                    <div
                        onClick={() => {
                            setBuilderInitialFlavor(undefined);
                            setBuilderInitialFlavors(undefined);
                            setBuilderInitialSize(undefined);
                            setBuilderInitialQuantity(undefined);
                            setBuilderEditingLineId(undefined);
                            setShowBuilder(true);
                        }}
                        className="p-4 mb-6 bg-white border border-gray-100 border-l-4 border-l-primary shadow-sm rounded-xl cursor-pointer hover:shadow-md hover:bg-gray-50 transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Spline size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-lg sm:text-xl text-gray-900 leading-tight group-hover:text-primary transition-colors">
                                    Armar Pizza Combinada
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    Elige 2 sabores • Mitad y Mitad
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    {/* Search Bar - Enhanced Visibility */}
                    <div className="p-4 bg-white border-b border-gray-100">
                        <div className="relative group">
                            {/* Animated gradient border effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-orange-400 to-primary rounded-xl opacity-20 group-hover:opacity-40 blur-sm transition-all duration-300 animate-pulse"></div>

                            <div className="relative bg-white rounded-xl shadow-lg border-2 border-primary/30 group-hover:border-primary/50 transition-all duration-300">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary animate-pulse" size={22} strokeWidth={2.5} />
                                <input
                                    type="text"
                                    placeholder="🔍 Buscar pizza... (ej: Hawaiana, Hawaiiana)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-10 py-4 bg-transparent border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-base font-medium text-gray-800 placeholder:text-gray-500"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-full active:scale-90"
                                    >
                                        <X size={20} strokeWidth={2.5} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Traditional List */}
                    <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-100">
                        <h3 className="font-heading text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {searchQuery ? `Resultados (${traditionalPizzas.length})` : `Pizzas Tradicionales (${traditionalPizzas.length})`}
                        </h3>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {traditionalPizzas.map((product) => renderCatalogItem(product))}
                    </div>
                </div>

            </div>

            {/* Builder Modal */}
            {showBuilder && (
                <PizzaBuilderModal
                    onClose={closeBuilderModal}
                    initialFlavor={builderInitialFlavor}
                    initialFlavors={builderInitialFlavors}
                    initialSize={builderInitialSize}
                    initialQuantity={builderInitialQuantity}
                    editingLineId={builderEditingLineId}
                />
            )}

            {/* Traditional Pizza Selection Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 animate-in slide-in-from-bottom-8 duration-300 sm:slide-in-from-bottom-0 max-h-[90vh] overflow-y-auto shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 pr-4">
                                <h3 className="font-heading text-2xl text-gray-900 leading-tight mb-1">
                                    {isCombinedSelection
                                        ? getCombinedTitle(selectedProduct)
                                        : selectedProduct.name}
                                </h3>
                                <p className="text-sm text-gray-500">{selectedProduct.description}</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="mb-5">
                            <button
                                onClick={handleMix}
                                disabled={selectedSize === 'Personal'}
                                className={`w-full px-4 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform animate-in fade-in zoom-in-95 duration-300
                                    ${selectedSize === 'Personal'
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-primary text-white hover:brightness-110 active:scale-[0.98]'}
                                `}
                            >
                                <GitMerge size={16} /> Combina dos sabores
                            </button>
                            {selectedSize === 'Personal' && (
                                <p className="mt-2 text-xs text-gray-400 text-center">Solo disponible en Mediana y Familiar</p>
                            )}
                        </div>

                        {/* Image */}
                        <div className="mb-4 rounded-xl overflow-hidden shadow-sm bg-gray-100 h-32 sm:h-36">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <div className="w-full bg-primary/15 text-primary/90 px-4 py-2 rounded-xl text-sm font-bold text-center mb-3">
                                Elige el tamaño
                            </div>
                            <div className={`grid gap-2 ${isCombinedSelection ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                {sizeOptions.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`
                                            py-3 rounded-xl text-sm font-bold border transition-all
                                            ${selectedSize === size
                                                ? 'border-primary bg-primary text-white shadow-md'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'}
                                        `}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Observaciones</label>
                            <textarea
                                value={productNote}
                                onChange={(e) => setProductNote(e.target.value)}
                                placeholder="Ej: sin cebolla, sin tomate, poco picante"
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary resize-none h-20"
                            />
                        </div>

                        {/* Quantity and Total */}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="text-xl font-bold text-gray-900 w-8 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs text-gray-500">Total</span>
                                <span className="font-black text-xl text-primary">{formatPrice(currentPrice * quantity)}</span>
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>{editingLineId ? 'Guardar cambios' : 'Agregar al Pedido'}</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-medium">
                                    {formatPrice(currentPrice * quantity)}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
