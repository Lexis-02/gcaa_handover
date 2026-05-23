<?php

declare(strict_types=1);

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::query()->create([
            'name' => $input['name'],
            'username' => $input['username'],
            'password' => $input['password'],
            'is_active' => true,
        ]);

        $invitation = request()->route('invitation');

        if ($invitation instanceof UserInvitation) {
            $user->syncRoles([$invitation->role]);

            if ($invitation->department_id) {
                $user->update(['department_id' => $invitation->department_id]);
            }

            $invitation->markAsUsed($user);
        }

        return $user;
    }
}
