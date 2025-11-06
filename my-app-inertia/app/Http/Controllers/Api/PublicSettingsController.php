<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Settings;

class PublicSettingsController extends Controller
{

    public function show()
    {
        $settings = Settings::firstOrCreate(['id' => 1]);
        
        return response()->json($settings);
    }
}