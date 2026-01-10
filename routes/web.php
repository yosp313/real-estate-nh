<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

// Language Switching
Route::get('/locale/{locale}', [LocaleController::class, 'setLocale'])->name('locale.set');

// The Home Page (Gallery)
Route::get('/', [ProjectController::class, 'index'])->name('home');

// Contact Form Submission
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// The Project Details Page
Route::get('/project/{project:slug}', [ProjectController::class, 'show'])->name('project.show');

// The "Action" Endpoint (Lead Capture)
Route::post('/project/{project:slug}/reserve', [ReservationController::class, 'store'])->name('project.reserve');
