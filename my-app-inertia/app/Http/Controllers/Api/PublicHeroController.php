<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageHero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PublicHeroController extends Controller
{
    public function index(Request $request)
    {
        $pageKey = $request->query('page', 'home');
        $hero = PageHero::where('page_key', $pageKey)->first();

        if (!$hero) {
            return response()->json(['message' => 'Hero not found'], 404);
        }

        if ($hero->media_path) {
            $hero->media_url = Storage::url($hero->media_path);
        }

        return response()->json($hero);
    }
}