<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserInvitationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('users.manage') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'role' => ['required', 'string', Rule::exists('roles', 'name')->where('guard_name', 'web')],
            'department_id' => ['nullable', 'exists:departments,id'],
            'label' => ['nullable', 'string', 'max:120'],
            'expiry_days' => ['nullable', 'integer', 'min:1', 'max:30'],
        ];
    }
}
