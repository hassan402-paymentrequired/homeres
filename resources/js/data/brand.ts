export const BRAND = {
    name: 'Homère',
    legalName: 'Homère Nigeria Limited',
    tagline:
        'Transform every house into a warm and inviting home through carefully curated luxury home decor.',
    email: 'support@homere.com',
    emails: {
        support: 'support@homere.com',
        info: 'info@homere.com',
        operations: 'operations@homere.com',
        partnerships: 'partnerships@homere.com',
        business: 'business@homere.com',
    },
    phone: '+2349115754421',
    phoneHref: 'tel:+2349115754421',
    address:
        'G5, Landmark Boulevard, Lagos Water Corporation Road, Eti-Osa II, Victoria Island, Lagos',
    mapUrl:
        'https://maps.google.com/?q=Landmark+Boulevard+Victoria+Island+Lagos',
    storeHours: 'Mon–Sat 10:00–19:00 · Sun 12:00–17:00',
    founded: 2021,
    founder: 'Gina Walschots',
} as const;

export const PREVIEW_NOTICE =
    'Luxury pieces sourced on request — lead times and final pricing confirmed after order review. Prices shown in NGN where available.';

export const WHY_CHOOSE = [
    {
        title: 'Quality Assurance',
        description:
            'We source from reputable manufacturers who adhere to the highest standards of quality and durability.',
    },
    {
        title: 'Diverse Selection',
        description:
            'An extensive range of decor, accessories, fragrances, furniture, and lighting for every style.',
    },
    {
        title: 'Exceptional Service',
        description:
            'Our team offers personalized recommendations and support at every step of your journey.',
    },
    {
        title: 'Affordable Luxury',
        description:
            'Elegance and quality made accessible — exceptional value without compromising sophistication.',
    },
    {
        title: 'Convenient Shopping',
        description:
            'A user-friendly experience with secure payment options, designed for effortless browsing.',
    },
] as const;

export const TESTIMONIALS = [
    {
        quote: 'I transformed my living room with the beautiful pieces I found at Homère Nigeria Limited. The quality is superb and the service was excellent.',
        author: 'Ademola',
        location: 'Lagos',
    },
    {
        quote: 'Homère has become my go-to for all my home decor needs. The variety and uniqueness of their products always impress me.',
        author: 'Chinwe',
        location: 'Abuja',
    },
] as const;
