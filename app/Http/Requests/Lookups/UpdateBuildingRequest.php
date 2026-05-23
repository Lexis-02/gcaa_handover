<?php

declare(strict_types=1);

namespace App\Http\Requests\Lookups;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBuildingRequest extends FormRequest
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
        $buildingId = $this->route('building')?->id;

        return [
            'name' => ['required', 'string', 'max:100', Rule::unique('buildings', 'name')->ignore($buildingId)],
            'region' => ['nullable', 'string', 'max:100'],
            'is_active' => ['boolean'],
        ];
    }
}
