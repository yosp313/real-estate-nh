<?php

namespace App\Services;

use App\Services\Exceptions\InvalidLocaleException;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LocaleService
{
    /**
     * Check if a locale is valid (exists in available_locales config).
     */
    public static function isValidLocale(string $locale): bool
    {
        return in_array($locale, config('app.available_locales', ['en']), true);
    }

    public function setLocale(string $locale): void
    {
        $availableLocales = config('app.available_locales', ['en']);

        if (! in_array($locale, $availableLocales, true)) {
            throw new InvalidLocaleException;
        }

        Session::put('locale', $locale);
        App::setLocale($locale);
    }
}
