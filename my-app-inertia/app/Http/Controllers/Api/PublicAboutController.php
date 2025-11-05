<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\CompanyAdvantage;
use Illuminate\Support\Facades\Storage;

class PublicAboutController extends Controller
{

    public function index()
    {
        $aboutItems = About::oldest()->get();
        $aboutItems->each(function ($item) {
            if ($item->image_path) {
                $item->image_url = Storage::url($item->image_path);
            }
        });
        return response()->json($aboutItems);
    }

    public function getAdvantages()
    {
        $advantages = CompanyAdvantage::orderBy('order', 'asc')
            ->orderBy('id', 'asc') 
            ->get();
        
        return response()->json($advantages);
    }
}