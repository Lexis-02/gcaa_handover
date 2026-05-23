<?php

declare(strict_types=1);

namespace App\Http\Requests\Lookups;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLookupValueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('config.manage') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $lookupValue = $this->route('lookup_value');

        return [
            'label' => [
                'required',
                'string',
                'max:100',
                Rule::unique('lookup_values', 'label')
                    ->where('type', $lookupValue->type)
                    ->ignore($lookupValue->id),
            ],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
            'is_active' => ['boolean'],
        ];
    }
}
