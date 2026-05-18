export interface CategoryChild {
    label: string;
    slug: string;
}

export interface Category {
    label: string;
    slug: string;
    description: string;
    children?: CategoryChild[];
}

export const CATEGORIES: Category[] = [
    {
        label: 'Home Decor',
        slug: 'home-decor',
        description: 'Wall art, vases, clocks, mirrors, and rugs to elevate every room.',
        children: [
            { label: 'Wall Art', slug: 'wall-art' },
            { label: 'Vases', slug: 'vases' },
            { label: 'Clocks', slug: 'clocks' },
            { label: 'Mirrors', slug: 'mirrors' },
            { label: 'Rugs', slug: 'rugs' },
        ],
    },
    {
        label: 'Home Accessories',
        slug: 'home-accessories',
        description: 'Cushions, throws, bowls, trays, frames, and candles.',
        children: [
            { label: 'Cushions & Throws', slug: 'cushions-throws' },
            { label: 'Bowls & Trays', slug: 'bowls-trays' },
            { label: 'Picture Frames', slug: 'picture-frames' },
            { label: 'Candles', slug: 'candles' },
        ],
    },
    {
        label: 'Home Fragrances',
        slug: 'home-fragrances',
        description: 'Scented candles, diffusers, room sprays, and essential oils.',
        children: [
            { label: 'Scented Candles', slug: 'scented-candles' },
            { label: 'Diffusers', slug: 'diffusers' },
            { label: 'Room Sprays', slug: 'room-sprays' },
            { label: 'Essential Oils', slug: 'essential-oils' },
        ],
    },
    {
        label: 'Furniture',
        slug: 'furniture',
        description: 'Sofas, tables, dining sets, beds, and storage for considered living.',
        children: [
            { label: 'Sofas & Armchairs', slug: 'sofas-armchairs' },
            { label: 'Coffee Tables', slug: 'coffee-tables' },
            { label: 'Dining Sets', slug: 'dining-sets' },
            { label: 'Beds & Mattresses', slug: 'beds' },
            { label: 'Storage', slug: 'storage' },
        ],
    },
    {
        label: 'Lighting',
        slug: 'lighting',
        description: 'Ceiling lights, floor lamps, table lamps, wall lights, and chandeliers.',
        children: [
            { label: 'Ceiling Lights', slug: 'ceiling-lights' },
            { label: 'Floor Lamps', slug: 'floor-lamps' },
            { label: 'Table Lamps', slug: 'table-lamps' },
            { label: 'Wall Lights', slug: 'wall-lights' },
            { label: 'Chandeliers', slug: 'chandeliers' },
        ],
    },
];

export function findCategory(slug: string | undefined): Category | undefined {
    if (!slug) {
        return undefined;
    }

    return CATEGORIES.find((c) => c.slug === slug);
}

export function findSubcategory(
    categorySlug: string,
    subSlug: string,
): CategoryChild | undefined {
    const category = findCategory(categorySlug);

    return category?.children?.find((c) => c.slug === subSlug);
}
