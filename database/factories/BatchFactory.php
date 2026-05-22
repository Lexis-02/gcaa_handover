<?php

namespace Database\Factories;

use App\Models\Batch;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BatchFactory extends Factory
{
    protected $model = Batch::class;

    public function definition(): array
    {
        $year = $this->faker->numberBetween(2025, 2030);
        $batchNum = $this->faker->numberBetween(1, 99);
        $totalPcs = $this->faker->numberBetween(5, 60);

        return [
            'batch_code' => sprintf('GCAA-%d-B%02d', $year, $batchNum),
            'year' => $year,
            'total_pcs' => $totalPcs,
            'serial_from' => '001',
            'serial_to' => sprintf('%03d', $totalPcs),
            'notes' => $this->faker->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
