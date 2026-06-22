<?php

namespace App\Http\Requests;

use App\Support\SiteLock;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UnlockSiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'password' => ['required', 'string'],
        ];
    }

    /**
     * @throws ValidationException
     */
    public function unlock(SiteLock $siteLock): void
    {
        $this->ensureIsNotRateLimited();

        if (! $siteLock->verifyPassword($this->string('password')->toString())) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'password' => 'The password is incorrect.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
        $siteLock->grantAccess($this);
    }

    /**
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'password' => "Too many attempts. Please try again in {$seconds} seconds.",
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate('site-lock|'.$this->ip());
    }
}
