<?php
// app/Http/Middleware/EnsureProfileComplete.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureProfileComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->isProfileComplete()) {
            return response()->json([
                'success' => false,
                'message' => 'Profile incomplete',
                'missing_steps' => $user ? $user->getMissingProfileSteps() : [],
            ], 403);
        }

        return $next($request);
    }
}