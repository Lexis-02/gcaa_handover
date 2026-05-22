<?php

namespace Database\Factories;

use App\Models\OldPcReturn;
use App\Models\PcAsset;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;

class OldPcReturnFactory extends Factory
{
    protected $model = OldPcReturn::class;

    public function definition(): array
    {
        return [
            'pc_asset_id' => PcAsset::factory(),
            'staff_id' => Staff::factory(),
            'old_asset_tag' => 'GCAA-OLD-' . $this->faker->unique()->numberBetween(10000, 99999),
            'old_make_model' => $this->faker->randomElement(['HP ProBook 450 G3', 'Dell Latitude 3470']),
            'old_serial_no' => strtoupper($this->faker->unique()->lexify('??????') . $this->faker->unique()->numberBetween(1000, 9999)),
            'year_of_purchase' => $this->faker->numberBetween(2018, 2023),
            'condition' => $this->faker->randomElement(['Working', 'Minor Defect', 'Beyond Repair', 'Scrap']),
            'reason_for_replacement' => 'End of lifecycle or technical depreciation.',
            'data_wiped' => false,
            'data_wiped_by' => null,
            'data_wiped_at' => null,
            'returned_to_stores' => false,
            'returned_at' => null,
        ];
    }
}
