<?php

namespace Database\Factories;

use App\Models\Batch;
use App\Models\PcAsset;
use Illuminate\Database\Eloquent\Factories\Factory;

class PcAssetFactory extends Factory
{
    protected $model = PcAsset::class;

    public function definition(): array
    {
        $batch = Batch::factory()->create();
        $serialNum = $this->faker->unique()->numberBetween(100, 999);
        $refNo = sprintf('GCAA-PC-%d-%s', $batch->year, $serialNum);

        return [
            'batch_id' => $batch->id,
            'ref_no' => $refNo,
            'asset_tag' => 'GCAA-TAG-' . $this->faker->unique()->numberBetween(10000, 99999),
            'make_model' => $this->faker->randomElement(['HP EliteBook 840 G10', 'Dell Latitude 5440', 'Lenovo ThinkPad T14']),
            'serial_number' => strtoupper($this->faker->unique()->lexify('??????') . $this->faker->unique()->numberBetween(1000, 9999)),
            'hostname' => 'GCAA-PC-' . $this->faker->unique()->numberBetween(10000, 99999),
            'os' => 'Windows 11 Pro',
            'condition_on_issue' => 'Sealed/New',
            'status' => 'pending',
            'assigned_staff_id' => null,
            'department_id' => null,
            'building_id' => null,
            'room_ext' => $this->faker->numerify('###'),
        ];
    }
}
