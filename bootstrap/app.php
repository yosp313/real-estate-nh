<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;
use App\Services\Exceptions\DuplicateReservationException;
use App\Services\Exceptions\InvalidLocaleException;
use App\Services\Exceptions\ReservationUnavailableException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            SetLocale::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (DuplicateReservationException $exception, Request $request) {
            throw ValidationException::withMessages([
                'email' => __('messages.already_registered'),
            ]);
        });

        $exceptions->render(function (ReservationUnavailableException $exception, Request $request) {
            throw ValidationException::withMessages([
                'project' => __('messages.project_unavailable'),
            ]);
        });

        $exceptions->render(function (InvalidLocaleException $exception, Request $request) {
            throw new NotFoundHttpException;
        });

        $exceptions->respond(function (Response $response) {
            if ($response->getStatusCode() < 500 || request()->isMethod('GET')) {
                return $response;
            }

            return back()->with('error', __('messages.unexpected_error'));
        });
    })->create();
