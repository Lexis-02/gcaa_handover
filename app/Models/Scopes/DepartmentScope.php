<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class DepartmentScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $user = Auth::user();
        if (!$user) {
            return;
        }

        // If user is super_admin, ict_admin, auditor, or stores_officer, they can see all.
        // If director, scope to department.
        // If end_user, scope to assigned staff ID.
        if ($user->hasRole('director')) {
            $builder->where($model->getTable() . '.department_id', $user->department_id);
        } elseif ($user->hasRole('end_user')) {
            $builder->where($model->getTable() . '.assigned_staff_id', $user->staff_id);
        }
    }
}
