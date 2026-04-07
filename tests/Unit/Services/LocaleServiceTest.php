<?php

namespace Tests\Unit\Services;

use App\Services\Exceptions\InvalidLocaleException;
use App\Services\LocaleService;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class LocaleServiceTest extends TestCase
{
    public function test_it_sets_the_selected_locale(): void
    {
        $service = new LocaleService;

        Config::set('app.available_locales', ['en', 'ar']);
        Session::start();

        $service->setLocale('ar');

        $this->assertSame('ar', App::getLocale());
        $this->assertSame('ar', Session::get('locale'));
    }

    public function test_it_throws_for_invalid_locale(): void
    {
        $service = new LocaleService;

        Config::set('app.available_locales', ['en', 'ar']);

        $this->expectException(InvalidLocaleException::class);

        $service->setLocale('fr');
    }

    public function test_is_valid_locale_returns_true_for_english(): void
    {
        Config::set('app.available_locales', ['en', 'ar']);

        $this->assertTrue(LocaleService::isValidLocale('en'));
    }

    public function test_is_valid_locale_returns_true_for_arabic(): void
    {
        Config::set('app.available_locales', ['en', 'ar']);

        $this->assertTrue(LocaleService::isValidLocale('ar'));
    }

    public function test_is_valid_locale_returns_false_for_invalid_locale(): void
    {
        Config::set('app.available_locales', ['en', 'ar']);

        $this->assertFalse(LocaleService::isValidLocale('fr'));
    }

    public function test_is_valid_locale_returns_false_for_empty_string(): void
    {
        Config::set('app.available_locales', ['en', 'ar']);

        $this->assertFalse(LocaleService::isValidLocale(''));
    }
}
