<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{

    public function show()
    {
        $settings = Settings::firstOrCreate(['id' => 1]);
        
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $settings = Settings::firstOrCreate(['id' => 1]);

        $validator = Validator::make($request->all(), [
            'footer_description' => 'nullable|string',
            'footer_description_id' => 'nullable|string',
            
            'contact_phone_number' => 'nullable|string|max:255',
            'contact_phone_href' => 'nullable|string|url:http,https|max:255',
            'contact_email' => 'nullable|string|email|max:255',
            
            'location_address' => 'nullable|string',
            'location_address_id' => 'nullable|string',
            'location_href' => 'nullable|string|url:http,https|max:255',
            
            'company_name' => 'nullable|string|max:255',
            'copyright_text' => 'nullable|string|max:255',
            'copyright_text_id' => 'nullable|string|max:255',

            'social_links' => 'nullable|array',
            'social_links.*.name' => 'required_with:social_links|string|max:255',
            'social_links.*.href' => 'required_with:social_links|string|url:http,https|max:255',
            'social_links.*.icon_name' => 'required_with:social_links|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $settings->update($validatedData);
        Cache::forget('site.settings');
        return response()->json($settings->fresh(), 200);
    }
}