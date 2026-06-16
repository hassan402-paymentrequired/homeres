<?php

namespace App\Support\Storefront;

final class ChatHelpKnowledge
{
    /**
     * @return array<string, string>
     */
    public static function topics(): array
    {
        return [
            'faq' => self::faq(),
            'shipping' => self::shipping(),
            'returns' => self::returns(),
            'terms' => self::terms(),
            'privacy' => self::privacy(),
            'about' => self::about(),
            'contact' => self::contact(),
            'store' => self::store(),
        ];
    }

    public static function forTopic(string $topic): ?string
    {
        return self::topics()[$topic] ?? null;
    }

    /**
     * @return list<string>
     */
    public static function topicKeys(): array
    {
        return array_keys(self::topics());
    }

    private static function faq(): string
    {
        return <<<'TEXT'
Homère FAQ:
- Delivers across Nigeria (Lagos, Abuja, and major cities). Shipping fees calculated at checkout.
- Flagship showroom: G5, Landmark Boulevard, Victoria Island, Lagos.
- Offers bespoke interior design and home styling for residential and commercial spaces (/services).
- Payment: card payments and trusted Nigerian payment providers at checkout.
TEXT;
    }

    private static function shipping(): string
    {
        return <<<'TEXT'
Shipping & Delivery:
- Orders processed within 2–5 business days. Made-to-order or large furniture may need extra lead time.
- Delivers to Lagos, Abuja, and major Nigerian cities. Remote areas may have additional fees or longer timelines.
- Shipping cost calculated at checkout by size, weight, and destination.
TEXT;
    }

    private static function returns(): string
    {
        return <<<'TEXT'
Returns & Refunds:
- Eligible items may be returned within 14 days if unused and in original packaging.
- Custom-made, final-sale, and opened fragrance products may not be returnable.
- Contact homerenigerialimited@gmail.com or +2349115754421 to start a return.
TEXT;
    }

    private static function terms(): string
    {
        return <<<'TEXT'
Terms summary: Using homere.ng means agreeing to Homère Nigeria Limited terms. Products subject to availability. Prices in displayed currency may change. Governed by Nigerian law. Full terms at /help/terms.
TEXT;
    }

    private static function privacy(): string
    {
        return <<<'TEXT'
Privacy summary: Homère Nigeria Limited protects personal data. Contact info used for orders, support, and opted-in marketing. Data handled with consent; requests to homerenigerialimited@gmail.com. Full policy at /help/privacy.
TEXT;
    }

    private static function about(): string
    {
        return <<<'TEXT'
About Homère Nigeria Limited:
- Luxury home decor, accessories, fragrances, furniture, and lighting. Founded 2021 by Gina Walschots in Victoria Island, Lagos.
- Mission: transform houses into warm, inviting homes through curated top-tier products.
- Services: interior design and home styling. See /about and /services.
TEXT;
    }

    private static function contact(): string
    {
        return <<<'TEXT'
Contact Homère:
- Email: homerenigerialimited@gmail.com
- Phone: +234 911 575 4421
- Address: G5, Landmark Boulevard, Lagos Water Corporation Road, Victoria Island, Lagos
- Contact page: /contact
TEXT;
    }

    private static function store(): string
    {
        return <<<'TEXT'
Shopping on Homère:
- Browse collections at /shop. New arrivals at /shop/new-arrivals.
- Product pages show pricing, variants, and add-to-cart. Wishlist saves items on your device.
- Checkout at /checkout. Account optional; guests can order with email and delivery details.
TEXT;
    }
}
