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
}
