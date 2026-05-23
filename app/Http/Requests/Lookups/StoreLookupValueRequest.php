<?php

declare(strict_types=1);

namespace App\Http\Requests\Lookups;

use App\Models\LookupValue;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLookupValueRequest extends FormRequest
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
        $type = $this->resolvedType();

        return [
            'label' => [
                'required',
                'string',
                'max:100',
                Rule::unique('lookup_values', 'label')->where('type', $type),
            ],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
            'is_active' => ['boolean'],
        ];
    }

    public function resolvedType(): string
    {
        $slug = $this->route('type');
        $type = LookupValue::resolveTypeFromSlug((string) $slug);

        abort_unless($type, 404);

        return $type;
    }
}
