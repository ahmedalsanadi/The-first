<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
// use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // your middleware aliases...
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'profile.complete' => \App\Http\Middleware\EnsureProfileComplete::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
         * Treat API routes as JSON always (so FormRequest validation and other exceptions
         * render as JSON even if Accept header is missing).
         */
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request, ?\Throwable $e = null) => $request->is('api/*') || $request->wantsJson()
        );

        // Validation errors -> 422 with field errors
        $exceptions->renderable(function (ValidationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        });

        // Model not found -> 404
        $exceptions->renderable(function (ModelNotFoundException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found.',
            ], 404);
        });

        // Unauthenticated -> 401
        $exceptions->renderable(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        });

        // Unauthorized -> 403
        $exceptions->renderable(function (AuthorizationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        });

        // Generic HTTP exceptions (use status code from the exception)
        $exceptions->renderable(function (HttpException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'HTTP error.',
            ], $e->getStatusCode());
        });

        // Fallback (unexpected) exceptions -> 500
        $exceptions->renderable(function (\Throwable $e, Request $request) {
            $message = config('app.debug') ? $e->getMessage() : 'Something went wrong. Please try again later.';
            return response()->json([
                'success' => false,
                'message' => $message,
            ], 500);
        });
    })
    ->create();
