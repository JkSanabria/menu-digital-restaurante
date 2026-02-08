
import { useState, useMemo } from 'react';
import { ArrowLeft, Check, Plus, Minus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import menuData from '../data/menu.json';
import { Product, MenuData } from '../types/menu';

// Type definitions
type PizzaSize = 'Mediana' | 'Familiar';

interface PizzaBuilderModalProps {
    onClose: () => void;
    initialFlavor?: Product;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function PizzaBuilderModal({ onClose, initialFlavor }: PizzaBuilderModalProps) {
    const { addToCart } = useCart();

    // Initial State - COMBINED ONLY
    const [selectedSize, setSelectedSize] = useState<PizzaSize>('Mediana');
    const [selectedFlavors, setSelectedFlavors] = useState<Product[]>(initialFlavor ? [initialFlavor] : []);
    const [quantity, setQuantity] = useState(1);

    // UX States
    const [showSuccess, setShowSuccess] = useState(false);

    // Extract Pizza Data
    const data = menuData as unknown as MenuData;
    const pizzaSection = data.find(s => s.id === 'pizzas');
    const traditionalPizzas = pizzaSection?.subcategories.find(s => s.id === 'pizzas-tradicionales')?.categories.flatMap(c => c.products) || [];
    const availableFlavors = traditionalPizzas;

    // Calculate Dynamic Price
    const currentPrice = useMemo(() => {
        if (selectedFlavors.length === 0) return 0;
        let total = 0;
        selectedFlavors.forEach(flavor => {
            const price = flavor.sizePrices?.[selectedSize] || flavor.price;
            total += price / 2;
        });
        return total;
    }, [selectedSize, selectedFlavors]);

    // Handlers
    const handleFlavorToggle = (product: Product) => {
        if (selectedFlavors.find(p => p.id === product.id)) {
            setSelectedFlavors(prev => prev.filter(p => p.id !== product.id));
        } else {
            if (selectedFlavors.length < 2) {
                setSelectedFlavors(prev => [...prev, product]);
            }
        }
    };

    const handleAddToCart = () => {
        if (selectedFlavors.length < 2) return;

        // Construct Product Object
        const baseProduct = selectedFlavors[0];
        const flavorNames = selectedFlavors.map(p => p.name.replace('Pizza ', '')).join(' / ');
        const finalName = `Combinada (${selectedSize}): ${flavorNames}`;
        // Use timestamp to allow multiple distinct combinations of same flavors if desired, 
        // or keep ID deterministic to group same combinations. 
        // User wants "Incorporar al listado como producto más".
        // Deterministic ID allows grouping quantity in cart.
        const uniqueId = `custom-pizza-combined-${selectedSize}-${selectedFlavors.map(p => p.id).sort().join('-')}`;

        const productToAdd: Product = {
            ...baseProduct,
            id: uniqueId,
            name: finalName,
            price: currentPrice,
            size: selectedSize,
            description: 'Mitad y Mitad',
            attributes: selectedFlavors.map(f => f.name)
        };

        for (let i = 0; i < quantity; i++) {
            addToCart(productToAdd);
        }

        setShowSuccess(true);
        setTimeout(() => {
            onClose();
        }, 800);
    };

    const isValid = selectedFlavors.length === 2;

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10 shrink-0">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl font-heading font-bold text-gray-900 flex-1 text-center md:text-left md:ml-4">
                        Armar Pizza Combinada
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">

                    {/* Success Overlay */}
                    {showSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                            <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-xl animate-in zoom-in flex flex-col items-center gap-2">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <Check size={32} strokeWidth={3} />
                                </div>
                                <span className="font-bold text-lg">¡Agregada al Menú!</span>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Tamaños */}
                    <section className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                            Elige el Tamaño
                        </h3>
                        <div className="flex gap-4 max-w-lg">
                            {(['Mediana', 'Familiar'] as PizzaSize[]).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`
                                        flex-1 py-4 rounded-xl font-bold text-sm transition-all border-2
                                        ${selectedSize === size
                                            ? 'border-primary bg-primary text-white shadow-lg transform scale-[1.02]'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}
                                    `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Step 2: Sabores */}
                    <section className="mb-8">
                        <div className="sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-3 flex items-center justify-between border-b border-transparent">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="bg-gray-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm">2</span>
                                Elige tus Sabores
                            </h3>
                            <div className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${selectedFlavors.length === 2 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {selectedFlavors.length}/2 Seleccionados
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                            {availableFlavors.map(product => {
                                const isSelected = selectedFlavors.some(p => p.id === product.id);
                                const isDisabled = !isSelected && selectedFlavors.length >= 2;
                                const specificPrice = product.sizePrices?.[selectedSize] || product.price;

                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => !isDisabled && handleFlavorToggle(product)}
                                        className={`
                                            flex items-center justify-between p-4 cursor-pointer transition-colors
                                            ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'}
                                            ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}
                                            `}>
                                                {isSelected && <Check size={14} className="text-white" />}
                                            </div>

                                            <div className="flex flex-col">
                                                <span className={`font-bold text-lg leading-tight ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                                    {product.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap ml-2">
                                            Mitad: {formatPrice(specificPrice / 2)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white shrink-0 z-20 safe-area-bottom">
                    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1 border border-gray-200">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-primary active:scale-95 transition-transform">
                                    <Minus size={18} />
                                </button>
                                <span className="w-8 text-center font-bold text-gray-800 tabular-nums">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-primary active:scale-95 transition-transform">
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-500 font-medium">Total Estimado</span>
                                <span className="font-heading font-black text-2xl text-primary leading-none">
                                    {formatPrice(currentPrice * quantity)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isValid}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2
                                ${isValid
                                    ? 'bg-primary hover:bg-red-700 active:scale-[0.98] shadow-primary/25'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                            `}
                        >
                            <span>Agregar Combinación</span>
                            {isValid && <Check size={20} strokeWidth={3} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
