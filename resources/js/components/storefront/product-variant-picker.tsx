import { useEffect, useMemo, useState } from 'react';
import type { StorefrontVariant } from '@/types/storefront-product';

type Props = {
    variants: StorefrontVariant[];
    selectedId: string | null;
    onSelect: (variantId: string) => void;
    optionLabels?: Record<string, string>;
};

function optionLabel(key: string, labels?: Record<string, string>): string {
    if (labels?.[key]) {
        return labels[key];
    }

    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProductVariantPicker({
    variants,
    selectedId,
    onSelect,
    optionLabels,
}: Props) {
    const selectedVariant = variants.find((variant) => variant.id === selectedId);

    const keys = useMemo(
        () => [
            ...new Set(
                variants.flatMap((variant) => Object.keys(variant.optionValues)),
            ),
        ],
        [variants],
    );

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
        () => selectedVariant?.optionValues ?? {},
    );

    useEffect(() => {
        if (selectedVariant) {
            setSelectedOptions(selectedVariant.optionValues);
        }
    }, [selectedVariant]);

    if (variants.length <= 1) {
        return null;
    }

    if (keys.length === 0) {
        return (
            <div className="pdp-variant-picker">
                <p className="pdp-label">Options</p>
                <div className="pdp-variant-options">
                    {variants.map((variant) => {
                        const isSelected = variant.id === selectedId;

                        return (
                            <button
                                key={variant.id}
                                type="button"
                                className={`pdp-variant-chip${isSelected ? ' pdp-variant-chip--active' : ''}`}
                                aria-pressed={isSelected}
                                onClick={() => onSelect(variant.id)}
                            >
                                {variant.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    const selectOption = (key: string, value: string) => {
        const next = { ...selectedOptions, [key]: value };
        setSelectedOptions(next);

        const match = variants.find((variant) =>
            keys.every(
                (optionKey) =>
                    !variant.optionValues[optionKey] ||
                    variant.optionValues[optionKey] === next[optionKey],
            ),
        );

        if (match) {
            onSelect(match.id);
        }
    };

    return (
        <div className="pdp-variant-picker">
            {keys.map((key) => {
                const values = [
                    ...new Set(
                        variants
                            .map((variant) => variant.optionValues[key])
                            .filter((value): value is string => Boolean(value)),
                    ),
                ];

                return (
                    <div key={key} className="pdp-variant-option-group">
                        <p className="pdp-label">{optionLabel(key, optionLabels)}</p>
                        <div className="pdp-variant-options">
                            {values.map((value) => {
                                const isSelected = selectedOptions[key] === value;

                                return (
                                    <button
                                        key={`${key}-${value}`}
                                        type="button"
                                        className={`pdp-variant-chip${isSelected ? ' pdp-variant-chip--active' : ''}`}
                                        aria-pressed={isSelected}
                                        onClick={() => selectOption(key, value)}
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
