<?php
// app/Http/Requests/VerifyOtpRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => 'required|string',
            'country_code' => 'required|string|regex:/^\+[0-9]{1,4}$/',
            'otp_code' => 'required|string|size:4|regex:/^[0-9]{4}$/',
        ];
    }

    public function messages(): array
    {
        return [
            'otp_code.required' => 'Verification code is required.',
            'otp_code.size' => 'Verification code must be 4 digits.',
            'otp_code.regex' => 'Verification code must contain only numbers.',
        ];
    }
}