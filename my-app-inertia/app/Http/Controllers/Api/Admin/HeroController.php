<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageHero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class HeroController extends Controller
{
    public function index()
    {
        $heroes = PageHero::oldest()->get();
        return response()->json($heroes);
    }

    public function show(PageHero $hero)
    {
        if ($hero->media_path) {
            $hero->media_url = Storage::url($hero->media_path);
        }
        return response()->json($hero);
    }

    public function update(Request $request, PageHero $hero)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'title_id' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'subtitle_id' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_id' => 'required|string',
            'media_type' => 'required|string|in:image,video',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,mov,webm|max:51200',
            '_method' => 'sometimes|required|in:PUT',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();
        
        $hero->update([
            'title' => $validated['title'],
            'title_id' => $validated['title_id'],
            'subtitle' => $validated['subtitle'],
            'subtitle_id' => $validated['subtitle_id'],
            'description' => $validated['description'],
            'description_id' => $validated['description_id'],
            'media_type' => $validated['media_type'],
        ]);

        if ($request->hasFile('media')) {
            if ($hero->media_path) {
                Storage::disk('public')->delete($hero->media_path);
            }
            $path = $request->file('media')->store('heroes', 'public');
            $hero->update(['media_path' => $path]);
        }

        $hero->refresh();
        if ($hero->media_path) {
            $hero->media_url = Storage::url($hero->media_path);
        }

        return response()->json($hero);
    }
}