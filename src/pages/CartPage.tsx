import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, Send, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [tipPercentage, setTipPercentage] = useState<number>(0);
    const [customTip, setCustomTip] = useState<number | null>(null);
    const [note, setNote] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | null>(null);
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'bank' | 'change_q' | 'change_bill'>('bank');

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const tipAmount = customTip !== null ? customTip : total * (tipPercentage / 100);
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

        // Show confirmation modal instead of sending directly
        setShowConfirmation(true);
    };

    const handlePaymentSelection = (method: 'efectivo' | 'transferencia') => {
        setPaymentMethod(method);
        setPaymentDetails({}); // Reset details on change
        if (method === 'transferencia') {
            setPaymentStep('bank');
            setShowPaymentModal(true);
        } else {
            setPaymentStep('change_q');
            setShowPaymentModal(true);
        }
    };

    const confirmPaymentDetails = (details: any) => {
        setPaymentDetails({ ...paymentDetails, ...details });
        setShowPaymentModal(false);
    };

    const confirmAndSend = () => {
        if (!paymentMethod) {
            alert("Por favor selecciona un método de pago");
            return;
        }

        let message = "*NUEVO PEDIDO - EL GALLINERAL*\n\n";

        message += `*CLIENTE*\n`;
        message += `Nombre: ${customerName}\n`;
        message += `Dir: ${address}\n\n`;

        message += `*PEDIDO*\n`;
        items.forEach(item => {
            message += `- ${item.quantity}x ${item.name} | ${formatPrice(item.price * item.quantity)}\n`;
        });

        message += `\nSubtotal: ${formatPrice(total)}`;

        if (tipAmount > 0) {
            const tipLabel = customTip !== null ? "Propina" : `Propina (${tipPercentage}%)`;
            message += `\n${tipLabel}: ${formatPrice(tipAmount)}`;
        }
        message += `\n*TOTAL: ${formatPrice(finalTotal)}*\n\n`;

        message += `*PAGO*\n`;
        if (paymentMethod === 'transferencia') {
            message += `Transferencia (${paymentDetails.bank || 'Bancolombia'})`;
        } else {
            message += `Efectivo`;
            if (paymentDetails.needsChange) {
                if (paymentDetails.billAmount) {
                    message += ` (Paga con: ${formatPrice(paymentDetails.billAmount)})`;
                    message += `\nVueltas: ${formatPrice((paymentDetails.billAmount || 0) - finalTotal)}`;
                } else {
                    message += ` (Requiere cambio)`;
                }
            } else {
                message += ` (Exacto)`;
            }
        }

        if (note && note.trim()) {
            message += `\n\n*NOTA*\n${note.trim()}`;
        }

        // WhatsApp with Colombian phone number
        const phoneNumber = "573195997515";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
        setShowConfirmation(false);
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
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition"
                >
                    Ir al Menú
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 max-w-lg pb-[400px] animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <h1 className="text-2xl font-heading text-gray-900">Tu Pedido</h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/')}
                        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-primary transition-colors"
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
                        className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        title="Vaciar carrito"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Customer Info Section - Standardized p-3 mb-4 rounded-lg */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                    <User size={16} className="text-primary" />
                    Información de entrega
                </h3>

                <div className="space-y-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">Nombre completo *</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                            <MapPin size={12} />
                            Dirección de entrega *
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ej: Calle 123 #45-67, Apto 301"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Cart Items - Standardized mb-4 */}
            <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-sm truncate flex-1 min-w-0">{item.name}</h3>

                        <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 h-8">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2 h-full text-gray-500 hover:text-primary hover:bg-gray-100 rounded-l-md transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold w-6 text-center text-gray-900">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 h-full text-gray-500 hover:text-primary hover:bg-gray-100 rounded-r-md transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <span className="font-bold text-primary text-sm w-[70px] text-right whitespace-nowrap">
                                {formatPrice(item.price * item.quantity)}
                            </span>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tipping Section */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-sm whitespace-nowrap">Propina</h3>
                        <div className="flex gap-2 flex-1">
                            {[0, 10, 15].map((pct) => (
                                <button
                                    key={pct}
                                    onClick={() => {
                                        setTipPercentage(pct);
                                        setCustomTip(null);
                                    }}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${tipPercentage === pct && customTip === null
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {pct === 0 ? 'No' : `${pct}%`}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setTipPercentage(0);
                                    setCustomTip(0);
                                }}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${customTip !== null
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                Otro
                            </button>
                        </div>
                    </div>

                    {customTip !== null && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <input
                                    type="number"
                                    value={customTip || ''}
                                    onChange={(e) => setCustomTip(Number(e.target.value))}
                                    placeholder="Ingresa el valor"
                                    className="w-full p-2 pl-6 border border-primary rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Method Section - Single Row 3 Columns */}
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center gap-2 h-9">
                    {/* Col 1: Cash */}
                    <button
                        onClick={() => handlePaymentSelection('efectivo')}
                        className={`px-3 h-full rounded-md text-xs font-bold border flex items-center gap-1 transition-colors ${paymentMethod === 'efectivo'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <span>💵</span> Efectivo
                    </button>

                    {/* Col 2: Transfer */}
                    <button
                        onClick={() => handlePaymentSelection('transferencia')}
                        className={`px-3 h-full rounded-md text-xs font-bold border flex items-center gap-1 transition-colors ${paymentMethod === 'transferencia'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <span>📱</span> Transf.
                    </button>

                    {/* Col 3: Details (The "Third Space") */}
                    <div className="flex-1 h-full bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center px-2 text-[10px] text-gray-500 text-center leading-tight overflow-hidden">
                        {paymentMethod === 'efectivo' && (
                            <span className="font-medium text-gray-700 truncate w-full">
                                {paymentDetails.needsChange
                                    ? `Cambio de: ${formatPrice(paymentDetails.billAmount || 0)}`
                                    : 'Pago Exacto'}
                            </span>
                        )}
                        {paymentMethod === 'transferencia' && (
                            <span className="font-medium text-gray-700 truncate w-full">
                                {paymentDetails.bank || 'Selecciona Banco'}
                            </span>
                        )}
                        {!paymentMethod && <span>Selecciona método</span>}
                    </div>
                </div>
            </div>

            {/* Note Section - Collapsible */}
            <div className="mb-24">
                {(!note || note.trim() === "") && (
                    <div className="mb-4 text-center">
                        <button
                            onClick={() => setNote(" ")}
                            className="text-sm font-bold text-primary hover:text-primary/80 flex items-center justify-center gap-1 mx-auto transition-colors"
                        >
                            <span>+</span> Agregar nota al pedido
                        </button>
                        <p className="text-[10px] text-gray-400 mt-1 max-w-[250px] mx-auto leading-tight">
                            (Detalles de dirección, sin cebolla, salsa aparte, etc.)
                        </p>
                    </div>
                )}

                {(note && note.trim() !== "") && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between items-center">
                            Notas adicionales
                            <button onClick={() => setNote("")} className="text-xs text-red-500 font-normal hover:text-red-700">Cancelar</button>
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ej: Casa esquinera puerta blanca... o Sin cebolla en la hamburguesa..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-sm resize-none h-20 placeholder:text-gray-400"
                            autoFocus
                        ></textarea>
                    </div>
                )}
            </div>

            {/* Summary Footer - Standardized p-3 */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                <div className="max-w-lg mx-auto">
                    <div className="flex justify-between mb-1 text-xs text-gray-500">
                        <span>Subtotal</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    {tipAmount > 0 && (
                        <div className="flex justify-between mb-1 text-xs text-green-600">
                            <span>{customTip !== null ? "Propina (Voluntaria)" : `Propina (${tipPercentage}%)`}</span>
                            <span>{formatPrice(tipAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between mb-3 text-lg font-bold text-gray-900 border-t border-dashed border-gray-300 pt-1">
                        <span>Total</span>
                        <span>{formatPrice(finalTotal)}</span>
                    </div>

                    <button
                        onClick={handleWhatsAppOrder}
                        className="w-full bg-organic hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    >
                        <Send size={18} />
                        <span>Enviar Pedido por WhatsApp</span>
                    </button>
                </div>
            </div>

            {/* Confirmation Modal - Standardized padding and border radius */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in slide-in-from-bottom-8 duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-red-600 text-white p-4 rounded-t-xl">
                            <h2 className="text-xl font-heading mb-1">¡Confirma tu Pedido!</h2>
                            <p className="text-white/90 text-xs">Revisa los detalles antes de enviar</p>
                        </div>

                        {/* Order Summary */}
                        <div className="p-4 space-y-3">
                            {/* Customer Info */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                                    <User size={14} className="text-primary" />
                                    Información de Entrega
                                </h3>
                                <p className="text-xs text-gray-600"><strong>Nombre:</strong> {customerName}</p>
                                <p className="text-xs text-gray-600"><strong>Dirección:</strong> {address}</p>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2 text-sm">Tu Pedido ({itemCount} items)</h3>
                                <div className="space-y-1.5">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-lg">
                                            <span className="flex-1">
                                                <strong>{item.quantity}x</strong> {item.name}
                                            </span>
                                            <span className="font-bold text-primary">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-200 pt-3 space-y-1.5">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                {tipAmount > 0 && (
                                    <div className="flex justify-between text-xs text-green-600">
                                        <span>{customTip !== null ? "Propina (Voluntaria)" : `Propina (${tipPercentage}%)`}</span>
                                        <span>{formatPrice(tipAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-dashed">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                                </div>
                            </div>

                            {note.trim() && (
                                <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                                    <p className="text-xs font-bold text-yellow-800 mb-0.5">📝 Nota:</p>
                                    <p className="text-xs text-yellow-700">{note}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-gray-50 rounded-b-xl space-y-3">
                            <button
                                onClick={confirmAndSend}
                                className="w-full bg-organic hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <Send size={18} />
                                <span>Confirmar y Enviar</span>
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-lg border border-gray-300 text-sm transition-all active:scale-[0.98]"
                                >
                                    Corregir
                                </button>
                                <button
                                    onClick={() => {
                                        setShowConfirmation(false);
                                        navigate('/');
                                    }}
                                    className="flex-1 bg-white hover:bg-gray-50 text-primary font-bold py-2.5 rounded-lg border border-primary text-sm transition-all active:scale-[0.98]"
                                >
                                    + Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-heading font-bold text-gray-900 mb-4 text-center">
                            {paymentStep === 'bank' && 'Selecciona tu Banco'}
                            {paymentStep === 'change_q' && '¿Necesitas vueltas?'}
                            {paymentStep === 'change_bill' && '¿Con qué billete pagas?'}
                        </h3>

                        {/* Bank Selection */}
                        {paymentStep === 'bank' && (
                            <div className="flex flex-col gap-2">
                                {['Bancolombia', 'Davivienda', 'DaviPlata', 'Nequi', 'Cualquiera'].map(bank => (
                                    <button
                                        key={bank}
                                        onClick={() => confirmPaymentDetails({ bank })}
                                        className="p-3 text-left rounded-lg bg-gray-50 hover:bg-primary/10 hover:text-primary font-medium transition-colors"
                                    >
                                        {bank}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Change Question */}
                        {paymentStep === 'change_q' && (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => confirmPaymentDetails({ needsChange: false })}
                                    className="p-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold"
                                >
                                    No, tengo exacto
                                </button>
                                <button
                                    onClick={() => setPaymentStep('change_bill')}
                                    className="p-4 rounded-xl bg-primary text-white hover:bg-red-700 font-bold"
                                >
                                    Sí, necesito cambio
                                </button>
                            </div>
                        )}

                        {/* Bill Selection */}
                        {paymentStep === 'change_bill' && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 text-center mb-2">Total a pagar: <span className="font-bold text-primary">{formatPrice(finalTotal)}</span></p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[5000, 10000, 20000, 50000, 100000].map(bill => (
                                        <button
                                            key={bill}
                                            onClick={() => confirmPaymentDetails({ needsChange: true, billAmount: bill })}
                                            className="p-3 rounded-lg bg-gray-50 hover:bg-primary/10 hover:text-primary font-bold transition-colors text-sm"
                                        >
                                            {formatPrice(bill)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="mt-6 w-full py-2 text-gray-400 text-sm hover:text-gray-600 border-t border-gray-100"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
