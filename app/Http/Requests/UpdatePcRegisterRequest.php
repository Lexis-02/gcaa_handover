<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Services\LookupService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePcRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pc.manage') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $pcAssetId = $this->route('pc_register')?->id ?? $this->route('pc_register');

        return [
            'asset_tag' => ['nullable', 'string', 'max:100', Rule::unique('pc_assets', 'asset_tag')->ignore($pcAssetId)],
            'make_model' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255', Rule::unique('pc_assets', 'serial_number')->ignore($pcAssetId)],
            'hostname' => ['nullable', 'string', 'max:255', Rule::unique('pc_assets', 'hostname')->ignore($pcAssetId)],
            'os' => ['required', 'string', 'max:100'],
            'condition_on_issue' => ['required', Rule::in(app(LookupService::class)->pcConditions())],
            'assigned_staff_id' => ['nullable', 'exists:staff,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'building_id' => ['nullable', 'exists:buildings,id'],
            'room_ext' => ['nullable', 'string', 'max:50'],
        ];
    }
}
