<?php

namespace App\Support\Storefront;

use Illuminate\Http\Request;

final class StorefrontCurrencyResolver
{
    public function resolve(?Request $request = null): StorefrontCurrencyContext
    {
        $request ??= request();

        if ($request !== null && $request->hasSession()) {
            $sessionCurrency = $request->session()->get('storefront_currency');

            if (is_string($sessionCurrency) && $this->isAllowedCurrency($sessionCurrency)) {
                return $this->contextForCurrency(strtoupper($sessionCurrency));
            }
        }

        $country = $this->detectCountryCode($request);

        return $this->contextForCountry($country);
    }

    public function setPreference(Request $request, string $currency): StorefrontCurrencyContext
    {
        $currency = strtoupper($currency);

        if (! $this->isAllowedCurrency($currency)) {
            return $this->resolve($request);
        }

        $request->session()->put('storefront_currency', $currency);

        return $this->contextForCurrency($currency);
    }

    public function clearPreference(Request $request): StorefrontCurrencyContext
    {
        $request->session()->forget('storefront_currency');

        return $this->resolve($request);
    }

    private function contextForCountry(string $countryCode): StorefrontCurrencyContext
    {
        $isNigeria = $countryCode === 'NG';

        return new StorefrontCurrencyContext(
            currency: $isNigeria ? 'NGN' : 'USD',
            countryCode: $countryCode,
            isNigeria: $isNigeria,
        );
    }

    private function contextForCurrency(string $currency): StorefrontCurrencyContext
    {
        return new StorefrontCurrencyContext(
            currency: $currency,
            countryCode: $currency === 'NGN' ? 'NG' : 'INTL',
            isNigeria: $currency === 'NGN',
        );
    }

    private function detectCountryCode(?Request $request): string
    {
        if ($request !== null) {
            foreach (['CF-IPCountry', 'X-Country-Code', 'X-App-Country'] as $header) {
                $value = $request->header($header);

                if (is_string($value) && strlen(trim($value)) === 2) {
                    return strtoupper(trim($value));
                }
            }
        }

        return strtoupper((string) config('storefront.default_country', 'NG'));
    }

    private function isAllowedCurrency(string $currency): bool
    {
        return in_array(strtoupper($currency), ['NGN', 'USD'], true);
    }
}
