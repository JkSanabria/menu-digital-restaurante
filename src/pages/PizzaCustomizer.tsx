
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Minus, X, Spline, ArrowLeft, GitMerge, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import menuData from '../data/menu.json';
import { MenuData, Product } from '../types/menu';
import PizzaBuilderModal from './PizzaBuilder';

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
    const { addToCart, updateQuantity, items } = useCart();

    // State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<PizzaSize>('Mediana');
    const [quantity, setQuantity] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Builder State
    const [showBuilder, setShowBuilder] = useState(false);
    const [builderInitialFlavor, setBuilderInitialFlavor] = useState<Product | undefined>(undefined);

    // Data Extraction
    const pizzaSection = data.find(s => s.id === 'pizzas');
    // Get all traditional pizzas flat list
    const allTraditionalPizzas = pizzaSection?.subcategories.find(s => s.id === 'pizzas-tradicionales')?.categories.flatMap(c => c.products) || [];

    // Filter pizzas based on search query
    const traditionalPizzas = allTraditionalPizzas.filter(pizza =>
        pizza.name.toLowerCase().includes(searchQuery.toLowerCase())
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

        for (let i = 0; i < quantity; i++) {
            addToCart(productToAdd);
        }

        // Close modal
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedSize('Mediana');
    };

    const handleMix = () => {
        if (!selectedProduct) return;
        setBuilderInitialFlavor(selectedProduct);
        setSelectedProduct(null); // Close traditional modal
        setShowBuilder(true); // Open builder modal
    }

    const openModal = (product: Product) => {
        setBuilderInitialFlavor(undefined); // Reset specific start flavor
        setSelectedProduct(product);
        setSelectedSize('Mediana'); // Reset to default
        setQuantity(1);
    };

    // ------------------------------------------------------------------
    // RENDERERS
    // ------------------------------------------------------------------

    // 1. List Item for "Tus Pizzas Seleccionadas" (Minimalist, No Image)
    const renderSelectedPizzaItem = (product: Product) => {
        const itemQuantity = (product as any).quantity || 1;

        return (
            <div key={product.id} className="flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-bottom-1">
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                        {product.name.replace('Pizza Combinada', 'Combinada')}
                    </span>
                    {/* Size Badge */}
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                        {product.size || 'Único'}
                    </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-semibold text-gray-900 text-sm hidden sm:block w-20 text-right">
                        {formatPrice(product.price * itemQuantity)}
                    </span>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                        <button
                            onClick={() => updateQuantity(product.id, itemQuantity - 1)}
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
                    <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-heading text-xl font-bold text-gray-900">Menú de Pizzas</h1>
                    <div className="w-10"></div>
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
                        onClick={() => { setBuilderInitialFlavor(undefined); setShowBuilder(true); }}
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

                    {/* Search Bar */}
                    <div className="p-4 bg-white border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar pizza por nombre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
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
                    onClose={() => setShowBuilder(false)}
                    initialFlavor={builderInitialFlavor}
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

                        {/* Image */}
                        <div className="mb-6 rounded-xl overflow-hidden aspect-video shadow-sm bg-gray-100 relative group">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />

                            {/* Mix Button Overlay */}
                            <button
                                onClick={handleMix}
                                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2 hover:bg-gray-900 hover:text-white transition-all transform active:scale-95 border border-white/20 z-10"
                            >
                                <GitMerge size={14} /> Combinar / Mitad y Mitad
                            </button>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Elige el tamaño</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['Personal', 'Mediana', 'Familiar'] as PizzaSize[]).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`
                                            py-3 rounded-lg text-sm font-bold border transition-all
                                            ${selectedSize === size
                                                ? 'border-primary bg-primary text-white shadow-md'
                                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}
                                        `}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
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
                                <span>Agregar al Pedido</span>
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
