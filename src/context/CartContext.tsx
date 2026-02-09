import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "../types/menu";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
    customerName: string;
    setCustomerName: (name: string) => void;
    customerAddress: string;
    setCustomerAddress: (address: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [storageLoaded, setStorageLoaded] = useState(false);

    const getCookie = (key: string) => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(`${key}=`))
            ?.split('=')[1] || '';
    };

    const setCookie = (key: string, value: string, days = 365) => {
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = `${key}=${value}; Expires=${expires}; Path=/; SameSite=Lax`;
    };

    const removeCookie = (key: string) => {
        document.cookie = `${key}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
    };

    useEffect(() => {
        const storedName = localStorage.getItem("cartCustomerName") || decodeURIComponent(getCookie('cartCustomerName'));
        const storedAddress = localStorage.getItem("cartCustomerAddress") || decodeURIComponent(getCookie('cartCustomerAddress'));

        if (storedName) setCustomerName(storedName);
        if (storedAddress) setCustomerAddress(storedAddress);

        setStorageLoaded(true);
    }, []);

    useEffect(() => {
        if (!storageLoaded) return;
        if (customerName) {
            localStorage.setItem("cartCustomerName", customerName);
            setCookie('cartCustomerName', encodeURIComponent(customerName));
        } else {
            localStorage.removeItem("cartCustomerName");
            removeCookie('cartCustomerName');
        }
    }, [customerName, storageLoaded]);

    useEffect(() => {
        if (!storageLoaded) return;
        if (customerAddress) {
            localStorage.setItem("cartCustomerAddress", customerAddress);
            setCookie('cartCustomerAddress', encodeURIComponent(customerAddress));
        } else {
            localStorage.removeItem("cartCustomerAddress");
            removeCookie('cartCustomerAddress');
        }
    }, [customerAddress, storageLoaded]);

    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                itemCount,
                customerName,
                setCustomerName,
                customerAddress,
                setCustomerAddress,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
