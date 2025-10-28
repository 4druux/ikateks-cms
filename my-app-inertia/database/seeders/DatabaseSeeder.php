<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Andrew S',
            'email' => 'admin123@gmail.com',
            'password' => '12345678',
            'role' => 'superadmin'
        ]);
    }
}
