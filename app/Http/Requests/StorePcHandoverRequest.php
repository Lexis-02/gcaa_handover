<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\PcAsset;
use App\Services\LookupService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePcHandoverRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user?->can('old-pc.submit')
            || $user?->can('stage1.signoff')
            || $user?->can('pc.manage')
            || $user?->can('stage.manage-all');
    }

    public function rules(): array
    {
        $lookups = app(LookupService::class);

        return [
            'pc_asset_id' => [
                'required',
                'integer',
                Rule::exists('pc_assets', 'id'),
                Rule::unique('old_pc_returns', 'pc_asset_id'),
            ],
            'old_asset_tag' => ['nullable', 'string', 'max:100'],
            'old_make_model' => ['required', 'string', 'max:255'],
            'old_serial_no' => ['required', 'string', 'max:255'],
            'year_of_purchase' => ['nullable', 'integer', 'min:1990', 'max:'.((int) date('Y') + 1)],
            'condition' => ['required', 'string', Rule::in($lookups->oldPcConditions())],
            'reason_for_replacement' => ['nullable', 'string', 'max:2000'],
            'data_wiped' => ['required', 'string', Rule::in($lookups->yesNoOptions())],
            'returned_to_stores' => ['required', 'string', Rule::in($lookups->yesNoOptions())],
            'return_action' => ['required', 'string', 'in:return_to_stores,given_to_user'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $pc = PcAsset::query()->find($this->input('pc_asset_id'));

            if ($pc && ! $pc->assigned_staff_id && ! $pc->assigned_user_name) {
                $validator->errors()->add(
                    'pc_asset_id',
                    'The selected PC must have an assigned end user before recording old PC details.',
                );
            }
        });
    }
}
