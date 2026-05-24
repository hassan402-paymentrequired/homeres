import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
    variantId: string;
    productId: string;
    name: string;
    variantName: string;
    category: string;
    price: number | null;
    priceOnRequest: boolean;
    quantity: number;
    image: string;
    alt: string;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    orderNote: string;
    openCart: () => void;
    closeCart: () => void;
    setOrderNote: (note: string) => void;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    subtotal: number;
    totalItems: number;
    hasPriceOnRequest: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [orderNote, setOrderNote] = useState('');

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.variantId === newItem.variantId);

            if (existing) {
                return prev.map((i) =>
                    i.variantId === newItem.variantId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                );
            }

            return [...prev, { ...newItem, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((variantId: string) => {
        setItems((prev) => prev.filter((i) => i.variantId !== variantId));
    }, []);

    const updateQuantity = useCallback((variantId: string, quantity: number) => {
        if (quantity < 1) {
            setItems((prev) => prev.filter((i) => i.variantId !== variantId));
        } else {
            setItems((prev) =>
                prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
            );
        }
    }, []);

    const subtotal = items.reduce((sum, item) => {
        if (item.priceOnRequest || item.price === null) {
            return sum;
        }

        return sum + item.price * item.quantity;
    }, 0);

    const hasPriceOnRequest = items.some((item) => item.priceOnRequest);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                orderNote,
                openCart,
                closeCart,
                setOrderNote,
                addItem,
                removeItem,
                updateQuantity,
                subtotal,
                totalItems,
                hasPriceOnRequest,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }

    return context;
}
