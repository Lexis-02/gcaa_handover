<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Services\LookupService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePcHandoverRequest extends FormRequest
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
            'old_asset_tag' => ['nullable', 'string', 'max:100'],
            'old_make_model' => ['required', 'string', 'max:255'],
            'old_serial_no' => ['required', 'string', 'max:255'],
            'year_of_purchase' => ['nullable', 'integer', 'min:1990', 'max:'.((int) date('Y') + 1)],
            'condition' => ['required', 'string', Rule::in($lookups->oldPcConditions())],
            'reason_for_replacement' => ['nullable', 'string', 'max:2000'],
            'data_wiped' => ['required', 'string', Rule::in($lookups->yesNoOptions())],
            'return_action' => ['required', 'string', 'in:return_to_stores,given_to_user'],
            'old_hostname' => ['nullable', 'string', 'max:255'],
            'given_to_fullname' => ['required_if:return_action,given_to_user', 'nullable', 'string', 'max:255'],
            'given_to_staff_number' => ['required_if:return_action,given_to_user', 'nullable', 'string', 'max:100'],
            'given_to_designation' => ['required_if:return_action,given_to_user', 'nullable', 'string', 'max:255'],
            'given_to_department_id' => ['required_if:return_action,given_to_user', 'nullable', 'integer', Rule::exists('departments', 'id')],
            'given_to_telephone' => ['required_if:return_action,given_to_user', 'nullable', 'string', 'max:100'],
        ];
    }
}
