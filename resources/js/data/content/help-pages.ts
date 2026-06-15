export interface HelpPage {
    slug: string;
    title: string;
    sections: { heading?: string; body: string }[];
}

export const HELP_PAGES: Record<string, HelpPage> = {
    faq: {
        slug: 'faq',
        title: 'Frequently Asked Questions',
        sections: [
            {
                body: 'This is a preview storefront. Answers below reflect intended Homère policies once the store launches.',
            },
            {
                heading: 'Do you deliver across Nigeria?',
                body: 'Yes. We plan to offer delivery to Lagos, Abuja, and other major cities. Shipping fees will be calculated at checkout based on your location.',
            },
            {
                heading: 'Can I visit your showroom?',
                body: 'Our flagship store is at G5, Landmark Boulevard, Victoria Island, Lagos. See the Contact page for opening hours.',
            },
            {
                heading: 'Do you offer interior design services?',
                body: 'Yes. Homère provides bespoke interior design and home styling for residential and commercial spaces. Visit our Design Studio page to learn more.',
            },
            {
                heading: 'What payment methods will you accept?',
                body: 'We intend to support card payments and trusted Nigerian payment providers. Details will be confirmed at launch.',
            },
        ],
    },
    shipping: {
        slug: 'shipping',
        title: 'Shipping & Delivery',
        sections: [
            {
                body: 'Homère Nigeria Limited delivers carefully packaged home decor, furniture, and lighting across Nigeria.',
            },
            {
                heading: 'Processing time',
                body: 'Orders are typically processed within 2–5 business days. Made-to-order or large furniture pieces may require additional lead time — we will contact you if so.',
            },
            {
                heading: 'Delivery areas',
                body: 'We deliver to Lagos, Abuja, and other major Nigerian cities. Remote areas may incur additional fees or longer timelines.',
            },
            {
                heading: 'Shipping costs',
                body: 'Shipping is calculated at checkout based on item size, weight, and destination. Free delivery may apply on qualifying orders — promotions will be shown at launch.',
            },
        ],
    },
    returns: {
        slug: 'returns',
        title: 'Returns & Refunds',
        sections: [
            {
                body: 'We want you to love every piece from Homère. If something is not right, we will work with you fairly and promptly.',
            },
            {
                heading: 'Return window',
                body: 'Eligible items may be returned within 14 days of delivery, provided they are unused and in original packaging.',
            },
            {
                heading: 'Non-returnable items',
                body: 'Custom-made pieces, final-sale items, and opened fragrance products may not be eligible for return.',
            },
            {
                heading: 'How to start a return',
                body: 'Contact us at homerenigerialimited@gmail.com or +2349115754421 with your order details. Our team will guide you through the process.',
            },
        ],
    },
    terms: {
        slug: 'terms',
        title: 'Terms of Service',
        sections: [
            {
                body: 'By using the Homère website you agree to these terms. This preview site is for design approval only — no binding purchase is made until the live store launches.',
            },
            {
                heading: 'Products & pricing',
                body: 'We strive to display accurate descriptions and prices. Sample prices on this preview may differ from final launch pricing.',
            },
            {
                heading: 'Intellectual property',
                body: 'All content, images, and branding on this site are owned by Homère Nigeria Limited unless otherwise stated.',
            },
        ],
    },
    privacy: {
        slug: 'privacy',
        title: 'Privacy Policy',
        sections: [
            {
                body: 'Homère Nigeria Limited respects your privacy and is committed to protecting your personal data.',
            },
            {
                heading: 'Information we collect',
                body: 'When you place an order or contact us, we may collect your name, email, phone number, delivery address, and payment-related information through secure processors.',
            },
            {
                heading: 'How we use your data',
                body: 'We use your information to process orders, provide customer support, send updates you have opted into, and improve our services.',
            },
            {
                heading: 'Contact',
                body: 'For privacy enquiries, email support@homere.com',
            },
        ],
    },
};

export const HELP_NAV = [
    { label: 'FAQ', slug: 'faq' },
    { label: 'Shipping', slug: 'shipping' },
    { label: 'Returns', slug: 'returns' },
    { label: 'Terms', slug: 'terms' },
    { label: 'Privacy', slug: 'privacy' },
] as const;
