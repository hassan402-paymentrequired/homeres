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
        title: 'Terms & Conditions',
        sections: [
            {
                body: 'Welcome to Homère. By accessing or using our website and services, you agree to be bound by the terms and conditions outlined here (“Terms”). These terms apply to all users—whether you’re browsing, purchasing, subscribing, or interacting with any part of our platform. If you don’t agree with any of the terms, we kindly ask that you refrain from using our services. We may update these Terms from time to time. Any changes will be posted here, and by continuing to use the website, you’re accepting the updated Terms.',
            },
            {
                heading: '1. Eligibility',
                body: 'To use this website, you must be at least the legal age of majority in your location or have the consent of a legal guardian. By using this site, you confirm that you meet these requirements.',
            },
            {
                heading: '2. Use of Our Services',
                body: 'You agree to use the website and its offerings only for lawful purposes and in a way that doesn’t infringe on the rights or restrict the use of the site by others. You may not: violate any laws or regulations; transmit any harmful software or code; attempt to access private areas of the website without authorization; or use the content for unauthorized commercial purposes.',
            },
            {
                heading: '3. Our Products & Services',
                body: 'Products shown on the site may be exclusive to our online store and subject to limited quantities. We strive to display all items accurately, but actual colors or details may vary depending on your device. We reserve the right to limit or refuse any order. If we suspect a pattern of unauthorized or fraudulent behavior, we may cancel your transaction.',
            },
            {
                heading: '4. Pricing & Payment',
                body: 'All prices are listed in the currency specified on the site and are subject to change without notice. We reserve the right to adjust prices, offers, or product availability at any time. You agree to provide accurate and up-to-date payment and billing information when placing an order. Any incorrect information may result in delays or cancellations.',
            },
            {
                heading: '5. Account Responsibility',
                body: 'If you create an account with us, you are responsible for keeping your login details confidential. Any activity under your account is assumed to be yours unless reported. Please notify us immediately if you suspect any unauthorized use of your account.',
            },
            {
                heading: '6. Third-Party Links & Tools',
                body: 'We may include links or access to tools hosted by third parties. These are provided for your convenience, and we do not monitor or control them. We are not responsible for any third-party services, their performance, or how they use your data. Use them at your own risk, and review their terms before engaging.',
            },
            {
                heading: '7. Submissions & Feedback',
                body: 'Any comments, suggestions, or content you submit to us—whether through the website or via email—may be used by Homère for business, creative, or marketing purposes. We are not obligated to maintain confidentiality or provide compensation for such submissions.',
            },
            {
                heading: '8. Intellectual Property',
                body: 'All content, including text, images, graphics, design, and logos, is the property of Homère or licensed to us. You may not copy, distribute, or reproduce any part of the website or its content without our written permission.',
            },
            {
                heading: '9. Errors, Inaccuracies & Availability',
                body: 'We do our best to ensure all information is current and accurate. However, errors may occasionally occur in product descriptions, pricing, or availability. We reserve the right to correct such errors and to cancel or refuse any orders impacted—even if they’ve already been submitted.',
            },
            {
                heading: '10. Termination of Use',
                body: 'We reserve the right to restrict, suspend, or terminate your access to our site or services at any time, without notice, if we believe you have violated these Terms. You may also stop using our site at any time. These Terms remain enforceable even after termination.',
            },
            {
                heading: '11. Limitation of Liability',
                body: 'To the extent permitted by law, Homère shall not be held liable for any indirect, incidental, or consequential damages arising from your use of our site or services. We provide our platform “as-is” without warranties of any kind, whether express or implied.',
            },
            {
                heading: '12. Indemnity',
                body: 'You agree to indemnify and hold Homère, our team, partners, and affiliates harmless from any claims or disputes arising from your use of our site, your violation of these Terms, or your infringement of any third-party rights.',
            },
            {
                heading: '13. Governing Law',
                body: 'These Terms are governed by and construed under the laws of Nigeria. Any legal disputes will be handled within the appropriate courts of this jurisdiction.',
            },
            {
                heading: '14. Updates to These Terms',
                body: 'We may revise these Terms occasionally. Updates will be posted on this page with the date of the latest version. By continuing to use the site, you agree to the current version of the Terms.',
            },
            {
                heading: '15. Contact Us',
                body: 'Have questions about these terms? We’d love to hear from you. Email: homerenigerialimited@gmail.com. Last updated: April 2025.',
            },
        ],
    },
    privacy: {
        slug: 'privacy',
        title: 'Privacy Policy',
        sections: [
            {
                heading: 'We Guarantee Your Privacy',
                body: 'If you provide us with contact information such as your email address, phone number, or postal address we will store this data to assist you in the future. For instance, we may use it to provide personalized advice, inform you about new offerings, request feedback, or address specific service needs. In certain situations, such as product recalls from our partners or suppliers, we may need to contact you directly. Your information may also be used to send newsletters, share promotional updates, or track campaign participation. For the processing of personal information, we will ask for and rely on your consent to process, store, and manage your personal data. You always have the right to access, correct, or withdraw this information at any time.',
            },
            {
                heading: 'Our Company',
                body: 'HOMERE NIGERIA LIMITED, 3/4 Water Corporation Road, Landmark Boulevard, Victoria Island, Nigeria. Tel: +234 911 575 4421. Email: homerenigerialimited@gmail.com / homereoperations@gmail.com. Corporate Affairs Commission Number (CAC): 1798854. TIN / Tax ID: 2201110118293.',
            },
            {
                heading: 'Email',
                body: 'If you have any questions about our services or data practices, please don’t hesitate to contact us at homerenigerialimited@gmail.com. Your email address will only be stored and used within the scope of an agreement. We will not send unsolicited messages without your explicit permission.',
            },
            {
                heading: 'Postal Address',
                body: 'We use your address exclusively for delivering services, sending orders, and providing requested information.',
            },
            {
                heading: 'Telephone',
                body: 'We will only contact you by phone when related to our services and always with your prior permission.',
            },
            {
                heading: 'Other Personal Information',
                body: 'We process personal information only if: it is required for fulfilling an agreement; it serves a justified public interest; it protects our legitimate interests (unless overridden by your rights); or you have given explicit consent. We retain your information only as long as necessary for the purposes for which it was collected.',
            },
            {
                heading: 'Sensitive Data',
                body: 'We treat your data with confidentiality and do not share it with other organizations unless legally required or with your consent.',
            },
            {
                heading: 'Transfer Safety',
                body: 'Whenever personal data is transferred to or from our website, we use encryption technologies that comply with industry standards. For sensitive data such as financial information, secure servers are always used. We apply appropriate security measures to prevent unauthorized access, loss, or misuse.',
            },
            {
                heading: 'Secure Storage of Data',
                body: 'All pages, including those where you input personal information, use secure (HTTPS) connections. Passwords are stored encrypted, and personal email communications are sent over secure channels. We implement both technical and organizational safeguards to prevent unauthorized processing or data breaches.',
            },
            {
                heading: 'Access to Your Data',
                body: 'You may request access to your personal data at any time. If you identify any incorrect or outdated information, we will correct, update, or delete it upon request. Requests can be made via email: homerenigerialimited@gmail.com.',
            },
            {
                heading: 'Contact',
                body: 'If you have any questions or wish to comment on our privacy practices, please get in touch using the contact information above. This privacy policy may be updated from time to time. Changes will be posted on this page.',
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
