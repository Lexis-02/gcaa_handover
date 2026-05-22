<?php

namespace Database\Seeders;

use App\Models\Building;
use Illuminate\Database\Seeder;

class BuildingSeeder extends Seeder
{
    public function run(): void
    {
        $buildings = [
            ['name' => 'HQ', 'region' => 'Greater Accra'],
            ['name' => 'GATA', 'region' => 'Greater Accra'],
            ['name' => 'Old HQ', 'region' => 'Greater Accra'],
            ['name' => 'ANS', 'region' => 'Greater Accra'],
            ['name' => 'Kumasi', 'region' => 'Ashanti'],
            ['name' => 'Tamale', 'region' => 'Northern'],
            ['name' => 'Sunyani', 'region' => 'Bono'],
        ];

        foreach ($buildings as $building) {
            Building::updateOrCreate(['name' => $building['name']], $building);
        }
    }
}
