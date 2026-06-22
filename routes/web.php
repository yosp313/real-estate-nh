<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;

// Language Switching
Route::get('/locale/{locale}', function (string $locale) {
    if (in_array($locale, config('app.available_locales', ['en']), true)) {
        Session::put('locale', $locale);
        App::setLocale($locale);
    }

    return redirect()->back();
})->name('locale.set');

// The Home Page (Gallery)
Route::get('/', [ProjectController::class, 'index'])->name('home');

// Projects Listing
Route::get('/projects', [ProjectController::class, 'listing'])->name('projects.index');

// Contact Form Submission
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('contact.store');

// The Project Details Page
Route::get('/project/{project:slug}', [ProjectController::class, 'show'])->name('project.show');

// The "Action" Endpoint (Lead Capture)
Route::post('/project/{project:slug}/reserve', [ReservationController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('project.reserve');