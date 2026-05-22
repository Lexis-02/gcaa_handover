<?php

namespace Database\Factories;

use App\Models\Building;
use App\Models\Department;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;

class StaffFactory extends Factory
{
    protected $model = Staff::class;

    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'staff_number' => 'GCAA-STF-' . $this->faker->unique()->numberBetween(1000, 9999),
            'designation' => $this->faker->jobTitle(),
            'department_id' => Department::factory(),
            'building_id' => Building::factory(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'user_id' => null,
            'is_active' => true,
        ];
    }
}
