import { Link } from '@inertiajs/react';
import { useState } from 'react';
import ProductVariantPicker from '@/components/storefront/product-variant-picker';
import { useCart } from '@/context/CartContext';
import { storefrontProductToCartItem } from '@/lib/cart';
import {
    resolveDisplayImages,
    resolveSelectedVariant,
    variantOptionLabels,
} from '@/lib/storefront-product-display';
import type { StorefrontProduct } from '@/types/storefront-product';

interface QuickShopPanelProps {
    product: StorefrontProduct;
    onClose: () => void;
}

export default function QuickShopPanel({ product, onClose }: QuickShopPanelProps) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
        product.defaultVariantId ?? product.variants?.[0]?.id ?? null,
    );
    const { addItem, openCart } = useCart();

    const selectedVariant = resolveSelectedVariant(product, selectedVariantId);
    const displayImages = resolveDisplayImages(product, selectedVariant);

    const handleAdd = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(
                storefrontProductToCartItem(
                    product,
                    selectedVariant?.id,
                    displayImages,
                ),
            );
        }

        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            onClose();
            openCart();
        }, 600);
    };

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(255,255,255,0.97)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderTop: '1px solid #e8e8e1',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {product.variants && product.variants.length > 1 && (
                <div style={{ marginBottom: '4px' }}>
                    <ProductVariantPicker
                        variants={product.variants}
                        selectedId={selectedVariant?.id ?? null}
                        onSelect={setSelectedVariantId}
                        optionLabels={variantOptionLabels(product)}
                    />
                </div>
            )}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #e8e8e1',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        style={{
                            width: '32px',
                            height: '32px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        −
                    </button>
                    <span style={{ width: '28px', textAlign: 'center', fontSize: '12px' }}>
                        {quantity}
                    </span>
                    <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        style={{
                            width: '32px',
                            height: '32px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        +
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    style={{
                        flex: 1,
                        background: added ? '#1a7a3c' : '#060606',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        fontSize: '10px',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                    }}
                >
                    {added ? 'Added' : 'Add to bag'}
                </button>
            </div>
            <Link
                href={`/products/${product.id}`}
                style={{
                    fontSize: '10px',
                    textAlign: 'center',
                    color: '#6b6b6b',
                    textDecoration: 'underline',
                }}
            >
                View details
            </Link>
        </div>
    );
}
