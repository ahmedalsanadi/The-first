<?php
// app/Http/Controllers/Api/DataController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\City;
use App\Models\Profession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DataController extends Controller
{
    public function countries(): JsonResponse
    {
        $countries = Country::active()
            ->select('id', 'name', 'code', 'phone_code')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $countries,
        ]);
    }

    public function cities(Request $request): JsonResponse
    {
        $query = City::active()->with('country:id,name,code');

        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }

        $cities = $query->select('id', 'name', 'name_ar', 'country_id')->get();

        return response()->json([
            'success' => true,
            'data' => $cities,
        ]);
    }

    public function professions(): JsonResponse
    {
        $professions = Profession::active()
            ->select('id', 'name', 'name_ar')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $professions,
        ]);
    }
}