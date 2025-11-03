<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Principals;
use Illuminate\Support\Facades\Storage;

class PublicPrincipalsController extends Controller
{
    public function index()
    {
        $principals = Principals::oldest()->get();
        $principals->each(function ($principal) {
            if ($principal->image_path) {
                $principal->image_url = Storage::url($principal->image_path);
            }
        });
        return response()->json($principals);
    }
}