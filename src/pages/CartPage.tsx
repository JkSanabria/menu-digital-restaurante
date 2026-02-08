import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, Send, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [tipPercentage, setTipPercentage] = useState<number>(0);
    const [note, setNote] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState("");

    const tipAmount = total * (tipPercentage / 100);
    const finalTotal = total + tipAmount;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleWhatsAppOrder = () => {
        if (!customerName.trim()) {
            alert("Por favor ingresa tu nombre");
            return;
        }
        if (!address.trim()) {
            alert("Por favor ingresa tu dirección de entrega");
            return;
        }

        let message = "*🍕 NUEVO PEDIDO - NAPOLI*\n\n";

        message += `👤 *Nombre:* ${customerName}\n`;
        message += `📍 *Dirección:* ${address}\n\n`;
        message += `*📋 Detalle del pedido:*\n`;

        items.forEach(item => {
            message += `▪️ ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})\n`;
        });

        message += `\n💰 *Subtotal:* ${formatPrice(total)}`;
        if (tipPercentage > 0) {
            message += `\n🎁 *Propina (${tipPercentage}%):* ${formatPrice(tipAmount)}`;
        }
        message += `\n\n*✅ TOTAL A PAGAR:* ${formatPrice(finalTotal)}`;

        if (note.trim()) {
            message += `\n\n📝 *Nota adicional:* ${note}`;
        }

        // WhatsApp with Colombian phone number
        const phoneNumber = "573195997515";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-10 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-orange-100 p-6 rounded-full mb-6">
                    <Trash2 size={48} className="text-primary/50" />
                </div>
                <h2 className="text-2xl font-heading text-gray-800 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8">¡Agrega algunas delicias de nuestro menú!</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition"
                >
                    Ir al Menú
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-lg pb-[400px] animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-heading text-gray-900">Tu Pedido</h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-primary transition-colors"
                        title="Ir al inicio"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                                clearCart();
                                navigate('/');
                            }
                        }}
                        className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        title="Vaciar carrito"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Customer Info Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    Información de entrega
                </h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <MapPin size={14} />
                            Dirección de entrega *
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ej: Calle 123 #45-67, Apto 301"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-800 leading-tight pr-2">{item.name}</h3>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex justify-between items-end mt-2">
                                <span className="font-semibold text-primary">{formatPrice(item.price)}</span>

                                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 px-2 text-gray-600 hover:bg-gray-200 rounded-l-lg"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 px-2 text-gray-600 hover:bg-gray-200 rounded-r-lg"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tipping Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Propina (Servicio)</h3>
                <div className="flex gap-2">
                    {[0, 10, 15].map((pct) => (
                        <button
                            key={pct}
                            onClick={() => setTipPercentage(pct)}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${tipPercentage === pct
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {pct === 0 ? 'No incluir' : `${pct}%`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Note Section */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Notas adicionales</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ej: Sin cebolla, salsa aparte..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none h-24"
                ></textarea>
            </div>

            {/* Summary Footer - Fixed */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                <div className="max-w-lg mx-auto">
                    <div className="flex justify-between mb-2 text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    {tipPercentage > 0 && (
                        <div className="flex justify-between mb-2 text-sm text-green-600">
                            <span>Propina ({tipPercentage}%)</span>
                            <span>{formatPrice(tipAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between mb-4 text-xl font-bold text-gray-900 border-t border-dashed border-gray-300 pt-2">
                        <span>Total</span>
                        <span>{formatPrice(finalTotal)}</span>
                    </div>

                    <button
                        onClick={handleWhatsAppOrder}
                        className="w-full bg-organic hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    >
                        <Send size={20} />
                        <span>Enviar Pedido por WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
