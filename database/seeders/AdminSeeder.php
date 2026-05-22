<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Seed the application's admin account.
     */
    public function run(): void
    {
        Admin::query()->firstOrCreate(
            ['email' => 'admin@homere.ng'],
            [
                'name' => 'Homère Admin',
                'password' => 'password',
            ],
        );
    }
}
