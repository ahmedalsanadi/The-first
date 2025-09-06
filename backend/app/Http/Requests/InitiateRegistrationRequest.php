<?php
// app/Http/Requests/InitiateRegistrationRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InitiateRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => [
                'required',
                'string',
                'regex:/^[0-9]+$/',
                function ($attribute, $value, $fail) {
                    $countryCode = $this->input('country_code');
                    if ($countryCode === '+967') {
                        $validPrefixes = ['70', '71', '73', '77', '78'];
                        $prefix = substr($value, 0, 2);

                        if (!in_array($prefix, $validPrefixes) || strlen($value) !== 9) {
                            $fail('Invalid Yemen phone number format. Must start with 70, 71, 73, 77, or 78 and be 9 digits.');
                        }
                    }
                },
            ],
            'country_code' => [
                'required',
                'string',
                'regex:/^\+[0-9]{1,4}$/',
                Rule::exists('countries', 'phone_code'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.required' => 'Phone number is required.',
            'phone.regex' => 'Phone number must contain only digits.',
            'country_code.required' => 'Country code is required.',
            'country_code.regex' => 'Invalid country code format.',
            'country_code.exists' => 'Country code not supported.',
        ];
    }
}