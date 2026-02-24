<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LocaleController extends Controller
{
    public function setLocale(Request $request, string $locale)
    {
        $availableLocales = config('app.available_locales', ['en']);

        if (! in_array($locale, $availableLocales)) {
            abort(404);
        }

        Session::put('locale', $locale);
        App::setLocale($locale);

        return redirect()->back();
    }
}
