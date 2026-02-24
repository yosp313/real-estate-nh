<?php

namespace App\Http\Controllers;

use App\Services\Exceptions\InvalidLocaleException;
use App\Services\LocaleService;
use Illuminate\Http\RedirectResponse;

class LocaleController extends Controller
{
    public function __construct(private LocaleService $localeService) {}

    public function setLocale(string $locale): RedirectResponse
    {
        try {
            $this->localeService->setLocale($locale);
        } catch (InvalidLocaleException) {
            abort(404);
        }

        return redirect()->back();
    }
}
