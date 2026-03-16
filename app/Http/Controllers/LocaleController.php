<?php

namespace App\Http\Controllers;

use App\Services\LocaleService;
use Illuminate\Http\RedirectResponse;

class LocaleController extends Controller
{
    public function __construct(private LocaleService $localeService) {}

    public function setLocale(string $locale): RedirectResponse
    {
        $this->localeService->setLocale($locale);

        return redirect()->back();
    }
}
