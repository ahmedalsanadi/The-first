<?php
// app/Http/Requests/CompleteProfileRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . auth()->id(),
            'city_id' => 'sometimes|exists:cities,id',
            'profession_id' => 'sometimes|exists:professions,id',
            'birth_date' => 'sometimes|date|before:18 years ago',
            'gender' => 'sometimes|in:male,female',
        ];
    }
}