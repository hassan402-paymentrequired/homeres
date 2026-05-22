/**
 * Homère storefront navigation — curated category tree.
 * Collection handles map to files in public/output/collections/.
 */

export interface NavLink {
    label: string;
    handle: string;
}

export interface NavColumn {
    title?: string;
    titleHandle?: string;
    links: NavLink[];
}

export interface StorefrontNavItem {
    label: string;
    href?: string;
    handle?: string;
    columns?: NavColumn[];
    links?: NavLink[];
}

export function collectionHref(handle: string): string {
    return `/collections/${handle}`;
}

function col(title: string, titleHandle: string, links: NavLink[]): NavColumn {
    return { title, titleHandle, links };
}

function link(label: string, handle: string): NavLink {
    return { label, handle };
}

export const STOREFRONT_NAV: StorefrontNavItem[] = [
    {
        label: 'Shop All',
        href: '/shop',
    },
    {
        label: 'Furniture',
        handle: 'furniture',
        columns: [
            col('Bedroom', 'bedroom', [
                link('Beds & Headboards', 'beds'),
                link('Nightstands', 'night-stands'),
                link('Cabinets & Dressers', 'cabinets-dressers-chests'),
                link('Wardrobes & Closets', 'closets'),
                link('Rugs & Carpets', 'rugs-carpets'),
            ]),
            col('Sofas & Seating', 'sofas', [
                link('Linear Sofas', 'linear-sofas'),
                link('Corner Sofas', 'corner-sofas'),
                link('Modular Sofas', 'modular-sofas'),
                link('Ottomans', 'ottomans'),
                link('Chaise Longues', 'chaise-longues'),
                link('Benches', 'benches'),
                link('Poufs', 'pouf'),
            ]),
            col('Chairs', 'chairs-arm-chairs', [
                link('Armchairs', 'armchairs'),
                link('Dining Chairs', 'dining-chairs-bar-stools'),
                link('Office Chairs', 'office-chairs'),
                link('Bar & Counter Stools', 'bar-counterstools'),
            ]),
            col('Tables & Desks', 'tables-desks', [
                link('Coffee Tables', 'coffee-tables'),
                link('Side Tables', 'side-tables'),
                link('Dining Tables', 'dining-tables'),
                link('Console Tables', 'console-tables'),
                link('Vanities', 'vanity'),
                link('Desks', 'desk'),
            ]),
            {
                links: [
                    link('Living Systems & Shelving', 'living-systems-bookshelves'),
                    link('Single Units', 'single-units'),
                    link('Trolleys & Bars', 'trolleys-bars'),
                    link('Leisure', 'leisure'),
                    link('Home Office', 'home-office'),
                ],
            },
        ],
    },
    {
        label: 'Lighting',
        handle: 'lighting',
        links: [
            link('Chandeliers', 'lanterns-chandeliers'),
            link('Ceiling Lamps', 'ceiling-lamps'),
            link('Table Lamps', 'wall-lamps-ceiling-lamps'),
            link('Floor Lamps', 'floor-lamps'),
            link('Wall Lamps', 'table-lamps-floor-lamps'),
        ],
    },
    {
        label: 'Home Accessories',
        handle: 'decor-accessories',
        columns: [
            col('Home Accessories', 'decor-accessories', [
                link('Candles & Home Fragrances', 'home-fragrance'),
                link('Candle & Tealight Holders', 'candle-holders-accessories'),
                link('Trays & Coasters', 'coasters'),
                link('Boxes', 'boxes'),
                link('Games', 'games'),
                link('Watch Accessories', 'watch-winders'),
                link('Objects', 'objects'),
                link('Picture Frames', 'picture-frames'),
                link('Bowls', 'bowls'),
            ]),
            col('Coffee Table Books', 'coffee-table-books-1', [
                link('The Travel Series', 'travel-series'),
                link('Design & Photography', 'design-architecture-1'),
                link('Fashion & Luxury', 'fashion-luxury-brands-books'),
                link('Art & Architecture', 'design-architecture'),
                link('The Ultimate Collection', 'the-ultimate-collection'),
                link('Limited Editions', 'special-edditions'),
                link('Book Stands & Loupes', 'bookends-book-stands'),
            ]),
            col('Art & Mirrors', 'art-mirrors', [
                link('Art', 'art'),
                link('Mirrors', 'mirrors'),
            ]),
            col('Cushions & Home Textiles', 'textiles', [
                link('Decorative Cushions', 'decorative-cushions-pillows'),
                link('Plaids', 'plaids'),
                link('Bedding', 'plaids-bedspreads'),
            ]),
            {
                links: [link('Wallpaper', 'wallpaper')],
            },
            col('Dining Essentials', 'dining-serveware', [
                link('Dinnerware', 'dinnerware'),
                link('Drinkware', 'drinkware'),
                link('Tabletop Accents', 'tabletop-accents'),
                link('Trays', 'trays-servings'),
            ]),
        ],
    },
    {
        label: 'Candles & Home Fragrances',
        handle: 'home-fragrance',
        links: [
            link('Scented Candles', 'scented-candles'),
            link('Room Sprays', 'home-sprays'),
            link('Totems & Diffusers', 'totems-diffusers'),
            link('Fragrance Accessories', 'fragrance-accessories'),
            link('Refills', 'refills'),
        ],
    },
    {
        label: 'Coffee Table Books',
        handle: 'coffee-table-books-1',
        links: [
            link('The Travel Series', 'travel-series'),
            link('Design & Photography', 'design-architecture-1'),
            link('Fashion & Luxury', 'fashion-luxury-brands-books'),
            link('Art & Architecture Books', 'design-architecture'),
            link('The Ultimate Collection', 'the-ultimate-collection'),
            link('Limited Editions', 'special-edditions'),
            link('Book Stands & Loupes', 'bookends-book-stands'),
        ],
    },
    {
        label: 'Flowers & Vases',
        handle: 'flowers-vases',
        links: [
            link('Flowers & Plants', 'artificial-flowers-plants'),
            link('Vases', 'vases'),
            link('Planters', 'pots-big-vases'),
        ],
    },
    {
        label: 'Wall Decoration',
        handle: 'art-mirrors',
        links: [
            link('Wallpaper', 'wallpaper'),
            link('Art', 'art'),
            link('Mirrors', 'mirrors'),
        ],
    },
    {
        label: 'Outdoor',
        handle: 'outdoor-collection',
        columns: [
            col('Outdoor Seating', 'outdoor-sofas-daybeds', [
                link('Linear Sofas', 'outdoor-linear-sofas'),
                link('Modular Sofas', 'outdoor-corner-sofas'),
                link('Ottomans', 'outdoor-ottomans'),
                link('Benches', 'outdoor-benches'),
                link('Poufs', 'outdoor-poufs'),
            ]),
            col('Daybeds & Sunbeds', 'outdoor-daybeds-sunbeds', [
                link('Daybeds', 'outdoor-daybeds'),
                link('Sunbeds', 'outdoor-sunbeds'),
            ]),
            col('Outdoor Chairs', 'outdoor-chairs', [
                link('Dining Chairs', 'outdoor-dining-chairs'),
                link('Armchairs', 'outdoor-arm-chairs'),
            ]),
            col('Outdoor Tables', 'outdoor-tables', [
                link('Coffee Tables', 'outdoor-coffee-table'),
                link('Side Tables', 'outdoor-side-tables'),
                link('Dining Tables', 'outdoor-dining-tables'),
            ]),
            {
                links: [
                    link('Outdoor Rugs', 'outdoor-carpets'),
                    link('Accessories', 'outdoor-accessories'),
                    link('Outdoor Lighting', 'outdoor-lighting'),
                ],
            },
        ],
    },
    {
        label: 'Design Studio',
        href: '/services',
    },
    {
        label: 'About',
        href: '/about',
    },
    {
        label: 'Contact',
        href: '/contact',
    },
];

export function navItemHref(item: StorefrontNavItem): string {
    if (item.href) {
        return item.href;
    }

    if (item.handle) {
        return collectionHref(item.handle);
    }

    return '#';
}

export function navLinkHref(link: NavLink): string {
    return collectionHref(link.handle);
}

export function hasDropdown(item: StorefrontNavItem): boolean {
    return Boolean(item.columns?.length || item.links?.length);
}
