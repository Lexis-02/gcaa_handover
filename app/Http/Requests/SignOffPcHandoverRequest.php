<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\PcAsset;
use App\Services\HandoverSignOffService;
use Illuminate\Foundation\Http\FormRequest;

class SignOffPcHandoverRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        $asset = $this->route('pc_register');

        if (! $user instanceof \App\Models\User || ! $asset instanceof PcAsset) {
            return false;
        }

        return app(HandoverSignOffService::class)->canUserSignOff($user, $asset) !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'notes' => ['nullable', 'string', 'max:2000'],
            'redirect' => ['nullable', 'string', 'in:queue,register'],
        ];
    }
}
