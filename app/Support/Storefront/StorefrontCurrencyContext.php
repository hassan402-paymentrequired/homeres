<?php

namespace App\Support\Storefront;

final readonly class StorefrontCurrencyContext
{
    public function __construct(
        public string $currency,
        public string $countryCode,
        public bool $isNigeria,
    ) {}

    /**
     * @return array{currency: string, country: string, is_nigeria: bool}
     */
    public function toArray(): array
    {
        return [
            'currency' => $this->currency,
            'country' => $this->countryCode,
            'is_nigeria' => $this->isNigeria,
        ];
    }
}
