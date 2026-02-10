import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, Send, User, MapPin, ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, total, clearCart, customerName, setCustomerName, customerAddress, setCustomerAddress } = useCart();
    const navigate = useNavigate();
    const [tipPercentage, setTipPercentage] = useState<number>(0);
    const [customTip, setCustomTip] = useState<number | null>(null);
    const [customTipInput, setCustomTipInput] = useState('');
    const [note, setNote] = useState("");
    const [showNote, setShowNote] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showModalValidation, setShowModalValidation] = useState(false);
    const branches = ['Crespo', 'Manga', 'Los Alpes'];
    const [deliveryMethod, setDeliveryMethod] = useState<'domicilio' | 'recoger'>('domicilio');
    const [selectedBranch, setSelectedBranch] = useState(branches[0]);
    const [openSection, setOpenSection] = useState<'delivery' | 'payment' | 'extras' | 'order' | null>('delivery');

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | null>(null);
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'bank' | 'change_q' | 'change_bill'>('bank');
    const [customPaymentInput, setCustomPaymentInput] = useState('');
    const [customPaymentValue, setCustomPaymentValue] = useState(0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const tipAmount = customTip !== null ? customTip : total * (tipPercentage / 100);
    const finalTotal = total + tipAmount;
    const deliveryMissingCount = (customerName.trim() ? 0 : 1) + (deliveryMethod === 'domicilio' && !customerAddress.trim() ? 1 : 0);
    const paymentMissingCount = !paymentMethod ? 1 : (paymentMethod === 'transferencia' && !paymentDetails.bank ? 1 : 0);

    const getSectionStatus = (missingCount: number) => {
        if (missingCount === 0) {
            return { label: 'Sección diligenciada', className: 'bg-green-50 text-green-700 border-green-200' };
        }
        return { label: `Faltan ${missingCount} ${missingCount === 1 ? 'dato' : 'datos'}`, className: 'bg-amber-50 text-amber-700 border-amber-200' };
    };

    const getFirstIncompleteSection = () => {
        if (deliveryMissingCount > 0) return 'delivery';
        if (paymentMissingCount > 0) return 'payment';
        return 'order';
    };

    useEffect(() => {
        if (!showConfirmation) return;
        setOpenSection(getFirstIncompleteSection());
    }, [showConfirmation, deliveryMissingCount, paymentMissingCount]);

    const deliveryStatus = getSectionStatus(deliveryMissingCount);
    const paymentStatus = getSectionStatus(paymentMissingCount);
    const extrasFilled = tipAmount > 0 || !!note.trim();
    const extrasStatus = extrasFilled
        ? { label: 'Sección diligenciada', className: 'bg-green-50 text-green-700 border-green-200' }
        : { label: 'Opcional', className: 'bg-gray-50 text-gray-600 border-gray-200' };
    const orderStatus = getSectionStatus(0);
    const toggleSection = (section: 'delivery' | 'payment' | 'extras' | 'order') => {
        setOpenSection((current) => (current === section ? null : section));
    };

    useEffect(() => {
        const storedNote = localStorage.getItem("cartNote") || '';
        if (storedNote) {
            setNote(storedNote);
            setShowNote(true);
        }
    }, []);

    useEffect(() => {
        if (note && note.trim()) {
            localStorage.setItem("cartNote", note);
        } else {
            localStorage.removeItem("cartNote");
        }
    }, [note]);


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getCurrencyInputState = (value: string) => {
        const digits = value.replace(/\D/g, '');
        const numeric = digits ? Number(digits) : 0;
        const formatted = digits ? new Intl.NumberFormat('es-CO').format(numeric) : '';
        return { numeric, formatted };
    };

    const getSmartPaymentOptions = (amount: number) => {
        const options = new Set<number>();

        // Basic Colombian Bills
        const bills = [2000, 5000, 10000, 20000, 50000, 100000];

        // 1. Add standard bills that cover the amount
        bills.forEach(bill => {
            if (bill > amount) options.add(bill);
        });

        // 2. Round up to nearest logical denominations (Smart Suggestions)
        // Next 10k (e.g. 125k -> 130k)
        const next10k = Math.ceil(amount / 10000) * 10000;
        if (next10k > amount) options.add(next10k);

        // Next 50k (e.g. 125k -> 150k)
        const next50k = Math.ceil(amount / 50000) * 50000;
        if (next50k > amount) options.add(next50k);

        // Next 100k (e.g. 125k -> 200k)
        const next100k = Math.ceil(amount / 100000) * 100000;
        if (next100k > amount) options.add(next100k);

        return Array.from(options).filter(opt => opt > amount).sort((a, b) => a - b).slice(0, 4);
    };

    const handleWhatsAppOrder = () => {
        setShowModalValidation(false);
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
        const missingName = !customerName.trim();
        const missingAddress = deliveryMethod === 'domicilio' && !customerAddress.trim();
        const missingPayment = !paymentMethod;

        if (missingName || missingAddress || missingPayment) {
            setShowModalValidation(true);
            return;
        }

        let message = "*NUEVO PEDIDO - EL GALLINERAL*\n\n";

        message += `*CLIENTE*\n`;
        message += `Nombre: ${customerName}\n`;
        message += `Entrega: ${deliveryMethod === 'recoger' ? `Recoger en restaurante (${selectedBranch})` : 'Domicilio'}\n`;
        if (deliveryMethod === 'domicilio') {
            message += `Dir: ${customerAddress}\n\n`;
        } else {
            message += `Sede: ${selectedBranch}\n\n`;
        }

        message += `*PEDIDO*\n`;
        items.forEach(item => {
            message += `- ${item.quantity}x ${item.name}`;
            if (item.note) {
                message += `\n  Nota: ${item.note}`;
            }
            message += ` | ${formatPrice(item.price * item.quantity)}\n`;
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
                    <Trash2 size={32} className="text-primary/50" />
                </div>
                <h2 className="text-xl md:text-2xl font-heading font-bold tracking-tight text-gray-900 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8">¡Agrega algunas delicias de nuestro menú!</p>
                <button
                    onClick={() => navigate('/')}
                    className="min-h-[44px] px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-red-700 transition-all active:scale-[0.98]"
                >
                    Ir al Menú
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 lg:py-8 max-w-lg md:max-w-6xl pb-[400px] lg:pb-12 animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="flex items-center justify-between mb-4 lg:mb-8 border-b border-gray-100 lg:border-b-2 lg:border-primary/10 pb-3 lg:pb-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="h-11 w-11 -ml-2 hover:bg-gray-100 rounded-full transition-all text-gray-600 hover:text-primary active:scale-95"
                        aria-label="Volver"
                    >
                        <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    </button>
                    <h1 className="text-2xl md:text-4xl font-heading font-black tracking-tight text-gray-900">Tu Pedido</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/')}
                        className="min-h-[44px] px-4 py-3 rounded-xl border border-primary/20 bg-white text-primary hover:bg-primary hover:text-white transition-all text-xs md:text-sm font-bold active:scale-[0.98]"
                    >
                        Seguir comprando
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="h-11 w-11 hover:bg-gray-100 rounded-full text-gray-600 hover:text-primary transition-colors"
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
                        className="h-11 w-11 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        title="Vaciar carrito"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Desktop: 2-column grid layout */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
                <div className="lg:col-span-2 space-y-4 lg:space-y-8">

                    {/* Customer Info Section */}
                    <div className="bg-white p-3 lg:p-6 rounded-lg lg:rounded-3xl shadow-sm border border-gray-100 mb-4 lg:mb-0 overflow-hidden lg:overflow-visible">
                        <button
                            onClick={() => toggleSection('delivery')}
                            className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-gray-50 transition-colors lg:hidden"
                        >
                            <span className="text-base font-heading font-bold text-gray-800">Información de entrega</span>
                            <span className="flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${deliveryStatus.className}`}>{deliveryStatus.label}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'delivery' ? 'rotate-180' : ''}`} />
                            </span>
                        </button>
                        <h3 className="hidden lg:flex text-base md:text-lg font-heading font-bold text-gray-800 mb-2 lg:mb-6 items-center gap-2">
                            <div className="hidden lg:block p-2 bg-primary/10 rounded-full text-primary">
                                <User size={24} />
                            </div>
                            Información de entrega
                        </h3>

                        <div className={`${openSection === 'delivery' ? 'block' : 'hidden'} lg:block space-y-3`}>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setDeliveryMethod('domicilio')}
                                    className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs font-bold border transition-colors ${deliveryMethod === 'domicilio'
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    🚚 Domicilio
                                </button>
                                <button
                                    onClick={() => setDeliveryMethod('recoger')}
                                    className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs font-bold border transition-colors ${deliveryMethod === 'recoger'
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    🏪 Recoger
                                </button>
                            </div>
                            {deliveryMethod === 'recoger' && branches.length > 1 && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Selecciona sede *</label>
                                    <select
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                        className="w-full p-2 lg:p-4 border border-gray-300 lg:bg-gray-50 lg:border-gray-100 rounded-lg lg:rounded-2xl focus:ring-1 focus:ring-primary focus:border-transparent text-sm lg:text-base"
                                    >
                                        {branches.map((branch) => (
                                            <option key={branch} value={branch}>{branch}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-0.5">Nombre completo *</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full p-2 lg:p-4 border border-gray-300 lg:bg-gray-50 lg:border-gray-100 rounded-lg lg:rounded-2xl focus:ring-1 focus:ring-primary focus:border-transparent text-sm lg:text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                                    <MapPin size={16} />
                                    Dirección de entrega {deliveryMethod === 'domicilio' ? '*' : '(solo domicilio)'}
                                </label>
                                <input
                                    type="text"
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    placeholder={deliveryMethod === 'domicilio' ? "Ej: Calle 123 #45-67, Apto 301" : "No aplica al recoger"}
                                    className="w-full p-2 lg:p-4 border border-gray-300 lg:bg-gray-50 lg:border-gray-100 rounded-lg lg:rounded-2xl focus:ring-1 focus:ring-primary focus:border-transparent text-sm lg:text-base"
                                    disabled={deliveryMethod === 'recoger'}
                                />
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="bg-white lg:bg-transparent p-3 lg:p-0 rounded-lg lg:rounded-none shadow-sm lg:shadow-none border border-gray-100 lg:border-0 mb-4 lg:mb-0 overflow-hidden lg:overflow-visible">
                        <button
                            onClick={() => toggleSection('order')}
                            className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-gray-50 transition-colors lg:hidden"
                        >
                            <span className="text-base font-heading font-bold text-gray-800">Tu pedido ({itemCount} {itemCount === 1 ? 'ítem' : 'ítems'})</span>
                            <span className="flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${orderStatus.className}`}>{orderStatus.label}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'order' ? 'rotate-180' : ''}`} />
                            </span>
                        </button>
                        <div className={`${openSection === 'order' ? 'flex' : 'hidden'} flex-col gap-3 lg:gap-4 lg:flex`}>
                            {items.map((item) => (
                                <div key={item.lineId} className="bg-white p-3 lg:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-2 lg:gap-4 lg:hover:shadow-md lg:hover:border-primary/20 transition-all">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base md:text-lg font-heading font-bold text-gray-800 truncate lg:whitespace-normal">{item.name}</h3>
                                        {item.note && (
                                            <p className="text-[11px] lg:text-sm text-gray-500 mt-0.5 truncate">📝 {item.note}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 lg:gap-6 shrink-0">
                                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 min-h-[44px] lg:p-1 lg:shadow-inner">
                                            <button
                                                onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                                                className="w-11 h-11 flex items-center justify-center bg-white rounded-l-xl text-gray-500 hover:text-primary hover:bg-gray-100 lg:hover:shadow-sm transition-colors lg:transition-all"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="text-sm lg:text-lg font-bold w-6 lg:w-10 text-center text-gray-900 lg:text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                                                className="w-11 h-11 flex items-center justify-center bg-white rounded-r-xl text-gray-500 hover:text-primary hover:bg-gray-100 lg:hover:shadow-sm transition-colors lg:transition-all"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <span className="font-bold text-primary text-sm lg:text-xl lg:font-black w-[70px] lg:w-[80px] text-right whitespace-nowrap">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>

                                        <button
                                            onClick={() => removeFromCart(item.lineId)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} className="lg:w-[20px] lg:h-[20px]" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={`${openSection === 'order' ? 'block' : 'hidden'} lg:hidden mt-3 border-t border-gray-200 pt-3 space-y-1.5`}>
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
                            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-dashed">
                                <span>Total</span>
                                <span className="text-primary">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>
                    </div>

                </div> {/* Close lg:col-span-2 for left column */}

                {/* RIGHT COLUMN: Desktop Sidebar */}
                <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4 lg:space-y-6">

                    {/* Tipping Section */}
                    <div className="bg-white p-3 lg:p-6 rounded-lg lg:rounded-3xl shadow-sm border border-gray-100 mb-4 lg:mb-0 overflow-hidden lg:overflow-visible">
                        <button
                            onClick={() => toggleSection('extras')}
                            className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-gray-50 transition-colors lg:hidden"
                        >
                            <span className="text-base font-heading font-bold text-gray-800">Propina y notas para el pedido</span>
                            <span className="flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${extrasStatus.className}`}>{extrasStatus.label}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'extras' ? 'rotate-180' : ''}`} />
                            </span>
                        </button>
                        <div className={`${openSection === 'extras' ? 'block' : 'hidden'} lg:block`}>
                            <div className="flex flex-col gap-2">
                                <div className="hidden lg:flex items-center justify-between gap-2 mb-4">
                                    <h3 className="text-base md:text-lg font-heading font-bold text-gray-800 whitespace-nowrap lg:whitespace-normal">Propina <span className="hidden lg:inline">para el Staff ❤️</span></h3>
                                </div>
                                <div className="flex gap-2 lg:hidden">
                                    {[0, 10, 15].map((pct) => (
                                        <button
                                            key={pct}
                                            onClick={() => {
                                                setTipPercentage(pct);
                                                setCustomTip(null);
                                                setCustomTipInput('');
                                            }}
                                            className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs font-bold border transition-colors ${tipPercentage === pct && customTip === null
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
                                            setCustomTipInput('');
                                        }}
                                        className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs font-bold border transition-colors ${customTip !== null
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        Otro
                                    </button>
                                </div>

                                {/* Desktop Tip Buttons */}
                                <div className="hidden lg:flex gap-2">
                                    {[0, 10, 15].map((pct) => (
                                        <button key={pct} onClick={() => { setTipPercentage(pct); setCustomTip(null); setCustomTipInput(''); }} className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl font-bold text-sm transition-all border-2 ${tipPercentage === pct && customTip === null ? 'border-primary bg-primary text-white shadow-md transform scale-105' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'}`}>{pct === 0 ? 'No' : `${pct}%`}</button>
                                    ))}
                                    <button onClick={() => { setTipPercentage(0); setCustomTip(0); setCustomTipInput(''); }} className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl font-bold text-sm transition-all border-2 ${customTip !== null ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'}`}>Otro</button>
                                </div>
                            </div>

                            {customTip !== null && (
                                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9.]*"
                                            value={customTipInput}
                                            onChange={(e) => {
                                                const { numeric, formatted } = getCurrencyInputState(e.target.value);
                                                setCustomTipInput(formatted);
                                                setCustomTip(numeric);
                                            }}
                                            placeholder="Ingresa el valor"
                                            className="w-full p-2 lg:p-3 pl-6 lg:pl-8 border border-primary lg:border-primary/20 rounded-lg lg:rounded-xl text-sm lg:text-lg focus:ring-1 lg:focus:ring-0 focus:ring-primary focus:border-primary font-medium lg:font-bold text-center"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Note Section */}
                    <div className={`mb-4 lg:mb-0 ${openSection === 'extras' ? 'block' : 'hidden'} lg:block`}>
                        {/* Mobile: Collapsible */}
                        <div className="lg:hidden">
                            {!showNote && (
                                <div className="mb-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <button
                                        onClick={() => setShowNote(true)}
                                        className="w-full min-h-[44px] px-4 py-3 rounded-xl text-left font-bold text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-xl">📝</span>
                                        <div className="flex-1">
                                            <div className="text-sm">Agregar nota al pedido</div>
                                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                                                (Detalles de dirección, sin cebolla, salsa aparte, etc.)
                                            </p>
                                        </div>
                                        <span className="text-2xl text-gray-300">+</span>
                                    </button>
                                </div>
                            )}
                            {showNote && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between items-center">
                                        Notas adicionales
                                        <button
                                            onClick={() => {
                                                setNote("");
                                                setShowNote(false);
                                            }}
                                            className="min-h-[44px] px-3 py-2 rounded-full text-xs text-red-500 font-normal hover:bg-red-50 hover:text-red-700 transition-colors"
                                        >
                                            Cancelar
                                        </button>
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

                        {/* Desktop: Always Visible */}
                        <div className="hidden lg:block">
                            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notas adicionales para el pedido..." className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[100px] resize-none"></textarea>
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="bg-white p-2 lg:p-6 rounded-lg lg:rounded-3xl shadow-sm border border-gray-100 mb-4 lg:mb-0 overflow-hidden lg:overflow-visible">
                        <button
                            onClick={() => toggleSection('payment')}
                            className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-gray-50 transition-colors lg:hidden"
                        >
                            <span className="text-base font-heading font-bold text-gray-800">Método de pago</span>
                            <span className="flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${paymentStatus.className}`}>{paymentStatus.label}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'payment' ? 'rotate-180' : ''}`} />
                            </span>
                        </button>
                        <div className={`${openSection === 'payment' ? 'block' : 'hidden'} lg:block`}>
                            {/* Mobile: Compact Row */}
                            <div className="flex items-center gap-2 min-h-[44px] lg:hidden">
                            {/* Col 1: Cash */}
                            <button
                                onClick={() => handlePaymentSelection('efectivo')}
                                className={`min-h-[44px] px-4 py-3 rounded-xl text-xs font-bold border flex items-center gap-1 transition-colors ${paymentMethod === 'efectivo'
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <span>💵</span> Efectivo
                            </button>

                            {/* Col 2: Transfer */}
                            <button
                                onClick={() => handlePaymentSelection('transferencia')}
                                className={`min-h-[44px] px-4 py-3 rounded-xl text-xs font-bold border flex items-center gap-1 transition-colors ${paymentMethod === 'transferencia'
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <span>📱</span> Transf.
                            </button>

                            {/* Col 3: Details (The "Third Space") */}
                            <div className="flex-1 min-h-[44px] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center px-2 text-[10px] text-gray-500 text-center leading-tight overflow-hidden">
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

                            {/* Desktop: Card Grid */}
                            <div className="hidden lg:block">
                            <h3 className="text-base md:text-lg font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-green-100 text-green-600 p-1.5 rounded-lg text-lg">💳</span>
                                Método de Pago
                            </h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button onClick={() => handlePaymentSelection('efectivo')} className={`min-h-[44px] px-4 py-3 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${paymentMethod === 'efectivo' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}><span className="text-2xl">💵</span><span className="font-bold text-sm">Efectivo</span></button>
                                <button onClick={() => handlePaymentSelection('transferencia')} className={`min-h-[44px] px-4 py-3 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${paymentMethod === 'transferencia' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}><span className="text-2xl">📱</span><span className="font-bold text-sm">Transf.</span></button>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center text-sm text-gray-600 font-medium">
                                {paymentMethod === 'efectivo' && (paymentDetails.needsChange ? `Cambio de: ${formatPrice(paymentDetails.billAmount || 0)}` : 'Pago Exacto')}
                                {paymentMethod === 'transferencia' && (paymentDetails.bank || 'Selecciona Banco')}
                                {!paymentMethod && 'Selecciona un método para continuar'}
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Summary - Integrated in sidebar */}
                    <section className="hidden lg:block bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-base text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-bold">{formatPrice(total)}</span>
                            </div>
                            {tipAmount > 0 && (
                                <div className="flex justify-between text-base text-green-600">
                                    <span>{customTip !== null ? "Propina (Voluntaria)" : `Propina (${tipPercentage}%)`}</span>
                                    <span className="font-bold">{formatPrice(tipAmount)}</span>
                                </div>
                            )}
                            <div className="border-t border-dashed border-gray-200 my-4"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-black text-primary">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        <button onClick={handleWhatsAppOrder} className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-organic hover:bg-green-700 text-white font-bold shadow-sm flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] group">
                            <span className="p-1 bg-white/20 rounded-full group-hover:rotate-12 transition-transform"><Send size={20} /></span>
                            <span className="text-lg">Enviar Pedido por WhatsApp</span>
                        </button>
                    </section>

                </div> {/* Close right column lg:col-span-1 */}
            </div> {/* Close lg:grid */}

            {/* Summary Footer - Mobile: Fixed Bottom | Desktop: Integrated in right column above */}
            <div className="fixed bottom-0 left-0 w-full lg:hidden bg-white border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
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
                        className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-organic hover:bg-green-700 text-white font-bold shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    >
                        <Send size={20} />
                        <span>Enviar Pedido por WhatsApp</span>
                    </button>
                </div>
            </div>

            {/* Confirmation Modal - Standardized padding and border radius */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto lg:max-h-none lg:overflow-visible animate-in zoom-in slide-in-from-bottom-8 duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-red-600 text-white p-6 rounded-t-2xl text-center">
                            <h2 className="text-xl md:text-2xl font-heading font-bold tracking-tight">Confirma tu pedido</h2>
                            <p className="text-white/95 text-xs lg:text-sm mt-2 font-semibold">
                                <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-semibold border border-white/20 bg-white/15">
                                    Revisa los detalles antes de enviar tu pedido
                                </span>
                            </p>
                        </div>

                        {/* Order Summary */}
                        <div className="p-6 space-y-3">
                            {/* Accordion */}
                            <div className="space-y-2">
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => toggleSection('delivery')}
                                        className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-base md:text-lg font-heading font-bold text-gray-800">Datos de entrega</span>
                                        <span className="flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] lg:text-xs font-semibold border ${deliveryStatus.className}`}>{deliveryStatus.label}</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'delivery' ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>
                                    {openSection === 'delivery' && (
                                        <div className="px-3 pb-3 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setDeliveryMethod('domicilio')}
                                                    className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs lg:text-sm font-bold border transition-colors ${deliveryMethod === 'domicilio'
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    🚚 Domicilio
                                                </button>
                                                <button
                                                    onClick={() => setDeliveryMethod('recoger')}
                                                    className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs lg:text-sm font-bold border transition-colors ${deliveryMethod === 'recoger'
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    🏪 Recoger
                                                </button>
                                            </div>
                                            {deliveryMethod === 'recoger' && branches.length > 1 && (
                                                <div>
                                                    <label className="block text-xs lg:text-sm font-semibold text-gray-600 mb-1">Selecciona sede *</label>
                                                    <select
                                                        value={selectedBranch}
                                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                                        className="w-full p-2 border border-gray-200 rounded-lg text-xs lg:text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary"
                                                    >
                                                        {branches.map((branch) => (
                                                            <option key={branch} value={branch}>{branch}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            <div>
                                                <label className="block text-xs lg:text-sm font-semibold text-gray-600 mb-1">Nombre completo *</label>
                                                <input
                                                    type="text"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder="Ej: Juan Pérez"
                                                    className={`w-full p-2 border rounded-lg text-xs lg:text-sm focus:ring-1 focus:ring-primary focus:border-primary ${showModalValidation && !customerName.trim() ? 'border-red-500 bg-red-50/60 ring-2 ring-red-200' : 'border-gray-200 bg-white'}`}
                                                />
                                                {showModalValidation && !customerName.trim() && (
                                                    <p className="text-[10px] text-red-600 font-semibold mt-1">Falta tu nombre para enviar el pedido.</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs lg:text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                                    <MapPin size={16} />
                                                    Dirección de entrega {deliveryMethod === 'domicilio' ? '*' : '(solo domicilio)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={customerAddress}
                                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                                    placeholder={deliveryMethod === 'domicilio' ? "Ej: Calle 123 #45-67, Apto 301" : "No aplica al recoger"}
                                                    className={`w-full p-2 border rounded-lg text-xs lg:text-sm focus:ring-1 focus:ring-primary focus:border-primary ${showModalValidation && deliveryMethod === 'domicilio' && !customerAddress.trim() ? 'border-red-500 bg-red-50/60 ring-2 ring-red-200' : 'border-gray-200 bg-white'}`}
                                                    disabled={deliveryMethod === 'recoger'}
                                                />
                                                {showModalValidation && deliveryMethod === 'domicilio' && !customerAddress.trim() && (
                                                    <p className="text-[10px] text-red-600 font-semibold mt-1">Agrega tu dirección para continuar.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => toggleSection('payment')}
                                        className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-base md:text-lg font-heading font-bold text-gray-800">Método de pago</span>
                                        <span className="flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] lg:text-xs font-semibold border ${paymentStatus.className}`}>{paymentStatus.label}</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'payment' ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>
                                    {openSection === 'payment' && (
                                        <div className={`px-3 pb-3 space-y-2 ${showModalValidation && !paymentMethod ? 'ring-2 ring-red-200 rounded-lg' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handlePaymentSelection('efectivo')}
                                                    className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs lg:text-sm font-bold border transition-colors ${paymentMethod === 'efectivo'
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    💵 Efectivo
                                                </button>
                                                <button
                                                    onClick={() => handlePaymentSelection('transferencia')}
                                                    className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs lg:text-sm font-bold border transition-colors ${paymentMethod === 'transferencia'
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    📱 Transf.
                                                </button>
                                            </div>

                                            {paymentMethod === 'efectivo' && (
                                                <div className="bg-white rounded-lg border border-gray-200 px-2 py-2 text-[11px] lg:text-sm text-gray-700">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold">Vueltas</span>
                                                        <button
                                                            onClick={() => {
                                                                setPaymentStep('change_q');
                                                                setShowPaymentModal(true);
                                                            }}
                                                            className="min-h-[44px] px-3 py-2 rounded-full text-primary font-bold text-[11px] hover:bg-primary/10 transition-all"
                                                        >
                                                            Editar
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 font-semibold">
                                                        {paymentDetails.needsChange
                                                            ? `Cambio de: ${formatPrice(paymentDetails.billAmount || 0)}`
                                                            : 'Pago Exacto'}
                                                    </p>
                                                </div>
                                            )}

                                            {paymentMethod === 'transferencia' && (
                                                <div className="bg-white rounded-lg border border-gray-200 px-2 py-2 text-[11px] lg:text-sm text-gray-700">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold">Transferencia</span>
                                                        <button
                                                            onClick={() => {
                                                                setPaymentStep('bank');
                                                                setShowPaymentModal(true);
                                                            }}
                                                            className="min-h-[44px] px-3 py-2 rounded-full text-primary font-bold text-[11px] hover:bg-primary/10 transition-all"
                                                        >
                                                            Cambiar banco
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 font-semibold">{paymentDetails.bank || 'Selecciona Banco'}</p>
                                                </div>
                                            )}

                                            {!paymentMethod && (
                                            <p className="text-[11px] lg:text-sm text-gray-500 font-semibold">Selecciona un método para continuar.</p>
                                            )}

                                            {showModalValidation && !paymentMethod && (
                                                <p className="text-[10px] text-red-600 font-semibold">Elige el método de pago para enviar.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => toggleSection('extras')}
                                        className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-base md:text-lg font-heading font-bold text-gray-800">Propina y notas para el pedido</span>
                                        <span className="flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] lg:text-xs font-semibold border ${extrasStatus.className}`}>{extrasStatus.label}</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'extras' ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>
                                    {openSection === 'extras' && (
                                        <div className="px-3 pb-3 space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    {[0, 10, 15].map((pct) => (
                                                        <button
                                                            key={pct}
                                                            onClick={() => {
                                                                setTipPercentage(pct);
                                                                setCustomTip(null);
                                                                setCustomTipInput('');
                                                            }}
                                                            className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs lg:text-sm font-bold border transition-colors ${tipPercentage === pct && customTip === null
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
                                                            setCustomTipInput('');
                                                        }}
                                                        className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl text-xs lg:text-sm font-bold border transition-colors ${customTip !== null
                                                            ? 'bg-primary text-white border-primary'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        Otro
                                                    </button>
                                                </div>
                                                {customTip !== null && (
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            pattern="[0-9.]*"
                                                            value={customTipInput}
                                                            onChange={(e) => {
                                                                const { numeric, formatted } = getCurrencyInputState(e.target.value);
                                                                setCustomTipInput(formatted);
                                                                setCustomTip(numeric);
                                                            }}
                                                            placeholder="Ingresa el valor"
                                                        className="w-full p-2 pl-6 border border-gray-200 rounded-lg text-xs lg:text-sm focus:ring-1 focus:ring-primary focus:border-primary text-center font-semibold"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                            <label className="block text-xs lg:text-sm font-bold text-gray-700 mb-1">📝 Notas adicionales</label>
                                                <textarea
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    placeholder="Ej: Casa esquinera puerta blanca... o Sin cebolla en la hamburguesa..."
                                                className="w-full p-2 border border-gray-200 rounded-lg text-xs lg:text-sm focus:ring-1 focus:ring-primary focus:border-primary resize-none h-20 placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => toggleSection('order')}
                                        className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-base md:text-lg font-heading font-bold text-gray-800">Resumen del pedido</span>
                                        <span className="flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] lg:text-xs font-semibold border ${orderStatus.className}`}>{orderStatus.label}</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'order' ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>
                                    {openSection === 'order' && (
                                        <div className="px-3 pb-3 space-y-2">
                                            <h3 className="text-base md:text-lg font-heading font-bold text-gray-800">Tu pedido ({itemCount} {itemCount === 1 ? 'ítem' : 'ítems'})</h3>
                                            <div className="space-y-1.5">
                                                {items.map((item) => (
                                                    <div key={item.lineId} className="flex justify-between items-center text-xs lg:text-sm bg-gray-50 p-2 rounded-lg">
                                                        <span className="flex-1">
                                                            <strong>{item.quantity}x</strong> {item.name}
                                                            {item.note && (
                                                                <span className="block text-[10px] text-gray-500 mt-0.5">📝 {item.note}</span>
                                                            )}
                                                        </span>
                                                        <span className="font-bold text-primary">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-t border-gray-200 pt-3 space-y-1.5">
                                                <div className="flex justify-between text-xs lg:text-sm text-gray-600">
                                                    <span>Subtotal</span>
                                                    <span>{formatPrice(total)}</span>
                                                </div>
                                                {tipAmount > 0 && (
                                                    <div className="flex justify-between text-xs lg:text-sm text-green-600">
                                                        <span>{customTip !== null ? "Propina (Voluntaria)" : `Propina (${tipPercentage}%)`}</span>
                                                        <span>{formatPrice(tipAmount)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-dashed">
                                                    <span>Total</span>
                                                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="p-6 bg-gray-50 rounded-b-2xl space-y-3">
                                <button
                                    onClick={confirmAndSend}
                                    className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-organic hover:bg-green-700 text-white font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                <Send size={20} />
                                <span>Confirmar y Enviar</span>
                            </button>

                            <button
                                onClick={() => {
                                    setShowConfirmation(false);
                                    navigate('/');
                                }}
                                className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-white hover:bg-primary hover:text-white text-primary font-bold border border-primary/20 text-sm transition-all active:scale-[0.98]"
                            >
                                Seguir comprando
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 min-h-[44px] px-4 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-bold border border-gray-300 text-sm transition-all active:scale-[0.98]"
                                >
                                    Corregir
                                </button>
                                <button
                                    onClick={() => {
                                        setShowConfirmation(false);
                                        navigate('/');
                                    }}
                                    className="flex-1 min-h-[44px] px-4 py-3 rounded-xl bg-white hover:bg-primary hover:text-white text-primary font-bold border border-primary/20 text-sm transition-all active:scale-[0.98]"
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
                        <h3 className="text-base md:text-lg font-heading font-bold text-gray-900 mb-4 text-center">
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
                                        className="min-h-[44px] px-4 py-3 rounded-xl bg-gray-50 hover:bg-primary/10 hover:text-primary font-medium transition-colors text-left"
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
                                    className="min-h-[44px] px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold"
                                >
                                    No, tengo exacto
                                </button>
                                <button
                                    onClick={() => setPaymentStep('change_bill')}
                                    className="min-h-[44px] px-4 py-3 rounded-xl bg-primary text-white hover:bg-red-700 font-bold"
                                >
                                    Sí, necesito cambio
                                </button>
                            </div>
                        )}

                        {/* Bill Selection */}
                        {paymentStep === 'change_bill' && (
                            <div className="space-y-4">
                                <div className="text-center mb-2">
                                    <p className="text-sm text-gray-600">Total a pagar</p>
                                    <p className="text-2xl font-black text-primary">{formatPrice(finalTotal)}</p>
                                </div>

                                <p className="text-sm font-bold text-gray-800">Sugerencias rápidas:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {getSmartPaymentOptions(finalTotal).map(bill => (
                                        <button
                                            key={bill}
                                            onClick={() => confirmPaymentDetails({ needsChange: true, billAmount: bill })}
                                            className="min-h-[44px] px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-primary hover:bg-primary/5 hover:text-primary font-bold transition-all text-sm flex flex-col items-center justify-center"
                                        >
                                            <span>{formatPrice(bill)}</span>
                                            <span className="text-[10px] text-gray-400 font-normal">Vuelto: {formatPrice(bill - finalTotal)}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="relative pt-2 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">O ingresa con cuánto pagas:</p>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9.]*"
                                                value={customPaymentInput}
                                                onChange={(e) => {
                                                    const { numeric, formatted } = getCurrencyInputState(e.target.value);
                                                    setCustomPaymentInput(formatted);
                                                    setCustomPaymentValue(numeric);
                                                }}
                                                className="w-full p-2 pl-6 border border-gray-300 rounded-lg text-sm font-bold focus:ring-1 focus:ring-primary focus:border-primary"
                                                placeholder="Ej: 135000"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (customPaymentValue > finalTotal) {
                                                    confirmPaymentDetails({ needsChange: true, billAmount: customPaymentValue });
                                                }
                                            }}
                                            disabled={!customPaymentInput || customPaymentValue <= finalTotal}
                                            className="min-h-[44px] px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            OK
                                        </button>
                                    </div>
                                    {customPaymentInput && customPaymentValue > finalTotal && (
                                        <p className="text-xs text-green-600 font-bold mt-1 text-right">
                                            Vuelto: {formatPrice(customPaymentValue - finalTotal)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="mt-6 w-full min-h-[44px] px-4 py-3 rounded-xl text-gray-500 text-sm hover:text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
