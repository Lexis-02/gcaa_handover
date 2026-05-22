<?php

namespace Database\Factories;

use App\Models\HandoverStage;
use App\Models\PcAsset;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HandoverStageFactory extends Factory
{
    protected $model = HandoverStage::class;

    public function definition(): array
    {
        $stageNum = $this->faker->randomElement([1, 2, 3]);
        return [
            'pc_asset_id' => PcAsset::factory(),
            'stage' => $stageNum,
            'actioned_by' => User::factory(),
            'actioned_at' => now(),
            'form_ref' => sprintf('ICT/PC-HO/%02d', $stageNum),
            'notes' => $this->faker->sentence(),
            'ip_address' => $this->faker->ipv4(),
            'pdf_path' => null,
        ];
    }
}
