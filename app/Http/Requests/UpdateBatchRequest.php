<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('batch.create') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'total_pcs' => ['required', 'integer', 'min:1', 'max:999'],
            'serial_from' => ['required', 'string', 'max:10', 'regex:/^\d+$/'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
