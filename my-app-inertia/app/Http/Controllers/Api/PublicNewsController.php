<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Support\Facades\Storage;

class PublicNewsController extends Controller
{

    public function index()
    {
        $newsItems = News::oldest()->get();
        $newsItems->each(function ($item) {
            if ($item->image_path) {
                $item->image_url = Storage::url($item->image_path);
            }
        });
        return response()->json($newsItems);
    }

    public function show(News $news) 
    {
        if ($news->image_path) {
            $news->image_url = Storage::url($news->image_path);
        }
        return response()->json($news);
    }
}