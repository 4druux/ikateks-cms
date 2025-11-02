<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class NewsController extends Controller
{

    public function index()
    {
        $newsItems = News::latest()->get();
        $newsItems->each(function ($item) {
            if ($item->image_path) {
                $item->image_url = Storage::url($item->image_path);
            }
        });
        return response()->json($newsItems);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:news,title',
            'description' => 'required|string',
            'title_id' => 'required|string|max:255',
            'description_id' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $dataToCreate = [
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'title_id' => $validatedData['title_id'],
            'description_id' => $validatedData['description_id'],
            'slug' => Str::slug($validatedData['title']),
            'image_path' => null, 
        ];

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
            $dataToCreate['image_path'] = $imagePath;
        }

        $newsItem = News::create($dataToCreate);

        if ($newsItem->image_path) {
            $newsItem->image_url = Storage::url($newsItem->image_path);
        }

        return response()->json($newsItem, 201);
    }

    public function show(News $news) 
    {
        if ($news->image_path) {
            $news->image_url = Storage::url($news->image_path);
        }
        return response()->json($news);
    }

    public function update(Request $request, News $news) 
    {
         $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:news,title,' . $news->id,
            'description' => 'required|string',
            'title_id' => 'required|string|max:255',
            'description_id' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            '_method' => 'sometimes|required|in:PUT',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        if ($request->filled('title') && $news->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        } else {
            unset($validated['title']);
        }

        if ($request->hasFile('image')) {
            if ($news->image_path) {
                Storage::disk('public')->delete($news->image_path);
            }
            $imagePath = $request->file('image')->store('news', 'public');
            $validated['image_path'] = $imagePath;
            unset($validated['image']);
        } else {
            unset($validated['image']);
        }

        $news->update($validated);
        $news->refresh(); 

        if ($news->image_path) {
            $news->image_url = Storage::url($news->image_path);
        }

        return response()->json($news);
    }

    public function destroy(News $news) 
    {
        if ($news->image_path) {
            Storage::disk('public')->delete($news->image_path);
        }
        $news->delete();
        return response()->json(['message' => 'News item deleted successfully.'], 200);
    }
}