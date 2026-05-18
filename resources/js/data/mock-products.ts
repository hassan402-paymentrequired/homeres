import { BRAND } from './brand';

export interface MockProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    priceFormatted: string;
    category: string;
    categorySlug: string;
    subcategorySlug?: string;
    description: string;
    details: string[];
    images: { src: string; alt: string }[];
    isNew?: boolean;
    dimensions?: string;
    material?: string;
    sku?: string;
}

function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString('en-NG')}`;
}

const products: MockProduct[] = [
    {
        id: 'P-001',
        name: 'Arc Floor Lamp',
        brand: BRAND.name,
        price: 480000,
        priceFormatted: formatNaira(480000),
        category: 'Lighting',
        categorySlug: 'lighting',
        subcategorySlug: 'floor-lamps',
        description:
            'A sculptural arc floor lamp with a hand-finished brass arm and a weighted marble base. Designed to cast a warm, directional glow over reading chairs and sofas.',
        details: [
            'Hand-finished brass arm',
            'Carrara marble base',
            'E27 bulb socket (bulb not included)',
            'Cable length: 2.5m with inline dimmer',
        ],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f5953049-1767872582568.png',
                alt: 'Arc floor lamp with curved brass arm and marble base',
            },
            {
                src: '/assets/images/Floor lamp Cassini - gold 2.jpg',
                alt: 'Arc floor lamp in a living room setting',
            },
        ],
        isNew: true,
        dimensions: 'W 60 × D 60 × H 180 cm',
        material: 'Brass, Carrara Marble',
        sku: 'HM-ARC-001',
    },
    {
        id: 'P-002',
        name: 'Linen Throw Cushion',
        brand: BRAND.name,
        price: 95000,
        priceFormatted: formatNaira(95000),
        category: 'Home Accessories',
        categorySlug: 'home-accessories',
        subcategorySlug: 'cushions-throws',
        description:
            'A generously filled cushion in tightly woven ivory boucle. Removable cover with a concealed zip closure.',
        details: [
            '100% boucle wool cover',
            'Feather and down inner',
            'Removable cover — dry clean only',
        ],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1065d7918-1771884763956.png',
                alt: 'Ivory boucle cushion on a linen sofa',
            },
        ],
        dimensions: '50 × 50 cm',
        material: 'Boucle Wool',
        sku: 'HM-CUS-002',
    },
    {
        id: 'P-003',
        name: 'Golden Chandelier',
        brand: BRAND.name,
        price: 1250000,
        priceFormatted: formatNaira(1250000),
        category: 'Lighting',
        categorySlug: 'lighting',
        subcategorySlug: 'chandeliers',
        description:
            'A statement chandelier with brushed gold arms and hand-cut crystal drops. Ideal for dining rooms and grand entryways.',
        details: ['Brushed gold finish', 'Hand-cut crystal drops', 'Dimmable when used with compatible bulbs'],
        images: [{ src: '/assets/images/Golden Chandelier-1.jpg', alt: 'Golden chandelier with crystal drops' }],
        sku: 'HM-CHN-003',
    },
    {
        id: 'P-004',
        name: 'Amber Glass Vase',
        brand: BRAND.name,
        price: 145000,
        priceFormatted: formatNaira(145000),
        category: 'Home Decor',
        categorySlug: 'home-decor',
        subcategorySlug: 'vases',
        description:
            'A smoked amber glass vase with an elongated silhouette. Mouth-blown with natural variations in tone.',
        details: ['Mouth-blown glass', 'Each piece is unique'],
        images: [
            {
                src: 'https://images.unsplash.com/photo-1612943727861-72cc8b272114',
                alt: 'Amber smoked glass statement vase',
            },
        ],
        isNew: true,
        sku: 'HM-VAS-004',
    },
    {
        id: 'P-005',
        name: 'Soy Wax Candle Set',
        brand: BRAND.name,
        price: 68000,
        priceFormatted: formatNaira(68000),
        category: 'Home Fragrances',
        categorySlug: 'home-fragrances',
        subcategorySlug: 'scented-candles',
        description:
            'A trio of hand-poured soy wax candles in glass vessels — notes of amber, oud, and white tea.',
        details: ['45-hour burn time per candle', 'Reusable glass vessels'],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d13c4a5-1772135351858.png',
                alt: 'Luxury soy wax candle set in glass vessels',
            },
        ],
        sku: 'HM-CAN-005',
    },
    {
        id: 'P-006',
        name: 'Floor Lamp Cassini — Gold',
        brand: BRAND.name,
        price: 144850,
        priceFormatted: formatNaira(144850),
        category: 'Lighting',
        categorySlug: 'lighting',
        subcategorySlug: 'floor-lamps',
        description:
            'The Cassini floor lamp in brushed gold — a refined silhouette that anchors living spaces with warm ambient light.',
        details: ['Brushed gold finish', 'Fabric shade included'],
        images: [{ src: '/assets/images/Floor lamp Cassini - gold 2.jpg', alt: 'Cassini gold floor lamp' }],
        isNew: true,
        sku: 'HM-CAS-006',
    },
    {
        id: 'P-007',
        name: 'Globo Tray',
        brand: BRAND.name,
        price: 144450,
        priceFormatted: formatNaira(144450),
        category: 'Home Accessories',
        categorySlug: 'home-accessories',
        subcategorySlug: 'bowls-trays',
        description:
            'A sculptural serving tray in polished brass — perfect for consoles, coffee tables, and styled vignettes.',
        details: ['Polished brass', 'Wipe clean with soft cloth'],
        images: [{ src: '/assets/images/Globo tray 2.jpg', alt: 'Globo brass serving tray' }],
        isNew: true,
        sku: 'HM-TRAY-007',
    },
    {
        id: 'P-008',
        name: 'Globe Top — Gold',
        brand: BRAND.name,
        price: 54480,
        priceFormatted: formatNaira(54480),
        category: 'Home Decor',
        categorySlug: 'home-decor',
        subcategorySlug: 'vases',
        description:
            'A decorative globe-top accent in brushed gold — an elegant objet for shelves and side tables.',
        details: ['Brushed gold finish', 'Display piece'],
        images: [{ src: '/assets/images/Globe top gold 3.jpg', alt: 'Gold globe decorative accent' }],
        sku: 'HM-GLO-008',
    },
    {
        id: 'P-009',
        name: 'Pantheon Armchair',
        brand: BRAND.name,
        price: 2850000,
        priceFormatted: formatNaira(2850000),
        category: 'Furniture',
        categorySlug: 'furniture',
        subcategorySlug: 'sofas-armchairs',
        description:
            'An elegant armchair in cream upholstery with solid wood legs — comfort meets sculptural form.',
        details: ['Solid wood legs', 'High-resilience foam'],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_16d8eaa84-1773371982097.png',
                alt: 'Pantheon armchair in cream fabric',
            },
        ],
        sku: 'HM-ARM-009',
    },
    {
        id: 'P-010',
        name: 'Candle — Amber Oud 220g',
        brand: BRAND.name,
        price: 64480,
        priceFormatted: formatNaira(64480),
        category: 'Home Fragrances',
        categorySlug: 'home-fragrances',
        subcategorySlug: 'scented-candles',
        description:
            'A rich amber oud fragrance in hand-poured soy wax. Approximately 45 hours burn time.',
        details: ['220g soy wax', 'Glass vessel included'],
        images: [{ src: '/assets/images/Golden Minnie Mouse - standing.jpg', alt: 'Amber oud scented candle' }],
        isNew: true,
        sku: 'HM-CAN-010',
    },
    {
        id: 'P-011',
        name: 'Eclipse Pendant Light',
        brand: BRAND.name,
        price: 3200000,
        priceFormatted: formatNaira(3200000),
        category: 'Lighting',
        categorySlug: 'lighting',
        subcategorySlug: 'ceiling-lights',
        description:
            'Eclipse pendant with brushed brass finish and a circular shade — a focal point for dining and kitchen islands.',
        details: ['Brushed brass', 'Adjustable suspension cable'],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e0ebb487-1779096448227.png',
                alt: 'Eclipse pendant light in brass',
            },
        ],
        sku: 'HM-PEN-011',
    },
    {
        id: 'P-012',
        name: 'Halo Ceramic Vase',
        brand: BRAND.name,
        price: 195000,
        priceFormatted: formatNaira(195000),
        category: 'Home Decor',
        categorySlug: 'home-decor',
        subcategorySlug: 'vases',
        description:
            'Halo vase in matte white ceramic with a curved silhouette — understated elegance for any surface.',
        details: ['Matte ceramic glaze', 'Suitable for dried botanicals'],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1389cd6c2-1772869406131.png',
                alt: 'Halo ceramic vase in matte white',
            },
        ],
        sku: 'HM-VAS-012',
    },
    {
        id: 'P-013',
        name: 'Cub Winder — Cover Brown',
        brand: BRAND.name,
        price: 94450,
        priceFormatted: formatNaira(94450),
        category: 'Home Accessories',
        categorySlug: 'home-accessories',
        subcategorySlug: 'cushions-throws',
        description:
            'A textured accent piece in warm brown — adds depth and tactility to sofas and reading nooks.',
        details: ['Premium textile cover'],
        images: [{ src: '/assets/images/Cub winder - cover brown .jpg', alt: 'Brown cub winder accent' }],
        sku: 'HM-TEX-013',
    },
    {
        id: 'P-014',
        name: 'Crystal Cut Ashtray',
        brand: BRAND.name,
        price: 85000,
        priceFormatted: formatNaira(85000),
        category: 'Home Decor',
        categorySlug: 'home-decor',
        subcategorySlug: 'vases',
        description:
            'Lead crystal cut ashtray — also beautiful as a catch-all for jewellery and keys on a console.',
        details: ['Lead crystal', 'Hand-cut facets'],
        images: [{ src: '/assets/images/Crystal cut ashtray 2.jpg', alt: 'Crystal cut decorative piece' }],
        sku: 'HM-CRY-014',
    },
    {
        id: 'P-015',
        name: 'Reed Diffuser — White Tea',
        brand: BRAND.name,
        price: 52000,
        priceFormatted: formatNaira(52000),
        category: 'Home Fragrances',
        categorySlug: 'home-fragrances',
        subcategorySlug: 'diffusers',
        description:
            'A long-lasting reed diffuser with notes of white tea and bergamot. Includes 200ml refill oil.',
        details: ['8 reeds included', 'Lasts up to 3 months'],
        images: [
            {
                src: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d13c4a5-1772135351858.png',
                alt: 'White tea reed diffuser',
            },
        ],
        sku: 'HM-DIF-015',
    },
];

export const MOCK_PRODUCTS: MockProduct[] = products;

export function getProductById(id: string): MockProduct | undefined {
    return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): MockProduct[] {
    return MOCK_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getNewArrivals(): MockProduct[] {
    return MOCK_PRODUCTS.filter((p) => p.isNew);
}

export function getRelatedProducts(
    product: MockProduct,
    limit = 4,
): MockProduct[] {
    return MOCK_PRODUCTS.filter(
        (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
    ).slice(0, limit);
}
