<?php

namespace Tests\Feature;

use Tests\TestCase;

class LocaleControllerTest extends TestCase
{
    public function test_it_sets_the_selected_locale_and_redirects_back(): void
    {
        config()->set('app.available_locales', ['en', 'ar']);

        $response = $this
            ->from('/')
            ->get(route('locale.set', ['locale' => 'ar']));

        $response->assertRedirect('/');
        $response->assertSessionHas('locale', 'ar');
    }

    public function test_it_returns_not_found_for_invalid_locale(): void
    {
        config()->set('app.available_locales', ['en', 'ar']);

        $response = $this->get(route('locale.set', ['locale' => 'fr']));

        $response->assertNotFound();
    }
}
