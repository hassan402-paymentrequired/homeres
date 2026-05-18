import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
    id: string;
    category: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    alt: string;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    subtotal: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

const defaultItems: CartItem[] = [
    {
        id: '1',
        category: 'Furniture',
        name: 'Pantheon Armchair',
        price: 2850,
        quantity: 1,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_16d8eaa84-1773371982097.png',
        alt: 'Elegant Pantheon armchair in cream fabric with wooden legs',
    },
    {
        id: '2',
        category: 'Lighting',
        name: 'Eclipse Pendant',
        price: 3200,
        quantity: 1,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e0ebb487-1779096448227.png',
        alt: 'Eclipse pendant light with brushed brass finish and circular shade',
    },
    {
        id: '3',
        category: 'Home Accessories',
        name: 'Halo Vase',
        price: 1950,
        quantity: 1,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1389cd6c2-1772869406131.png',
        alt: 'Halo ceramic vase in matte white with curved silhouette',
    },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(defaultItems);
    const [isOpen, setIsOpen] = useState(false);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === newItem.id);

            if (existing) {
                return prev.map((i) =>
                    i.id === newItem.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                );
            }

            return [...prev, { ...newItem, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) {
            setItems((prev) => prev.filter((i) => i.id !== id));
        } else {
            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
            );
        }
    }, []);

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                openCart,
                closeCart,
                addItem,
                removeItem,
                updateQuantity,
                subtotal,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);

    if (!ctx) {
        throw new Error('useCart must be used within CartProvider');
    }

    return ctx;
}
