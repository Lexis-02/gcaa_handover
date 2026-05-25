<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return $response;
            }

            $status = $response->getStatusCode();

            if (! in_array($status, [403, 404, 500, 503], true)) {
                return $response;
            }

            $message = $exception instanceof HttpException
                ? $exception->getMessage()
                : null;

            if ($message === '' || $message === '0') {
                $message = null;
            }

            return Inertia::render('errors/not-found', [
                'status' => $status,
                'message' => $message ?? match ($status) {
                    403 => 'You do not have permission to access this resource.',
                    500, 503 => 'Something went wrong on our end. Please try again later.',
                    default => 'The page you requested could not be found. It may have been moved, removed, or the address may be incorrect.',
                },
            ])
                ->toResponse($request)
                ->setStatusCode($status);
        });
    })->create();
