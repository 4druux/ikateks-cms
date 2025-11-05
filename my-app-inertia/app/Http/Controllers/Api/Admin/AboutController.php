<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\CompanyAdvantage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AboutController extends Controller
{

    public function indexAbout()
    {
        $aboutItems = About::oldest()->get();
        $aboutItems->each(function ($item) {
            if ($item->image_path) {
                $item->image_url = Storage::url($item->image_path);
            }
        });
        return response()->json($aboutItems);
    }

    public function storeAbout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:about,title',
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
            'image_path' => null, 
        ];

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('about', 'public');
            $dataToCreate['image_path'] = $imagePath;
        }

        $aboutItem = About::create($dataToCreate);

        if ($aboutItem->image_path) {
            $aboutItem->image_url = Storage::url($aboutItem->image_path);
        }

        return response()->json($aboutItem, 201);
    }

    public function showAbout(About $about) 
    {
        if ($about->image_path) {
            $about->image_url = Storage::url($about->image_path);
        }
        return response()->json($about);
    }

    public function updateAbout(Request $request, About $about) 
    {
         $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:about,title,' . $about->id,
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

        if ($request->hasFile('image')) {
            if ($about->image_path) {
                Storage::disk('public')->delete($about->image_path);
            }
            $imagePath = $request->file('image')->store('about', 'public');
            $validated['image_path'] = $imagePath;
            unset($validated['image']);
        } else {
            unset($validated['image']);
        }

        $about->update($validated);
        $about->refresh(); 

        if ($about->image_path) {
            $about->image_url = Storage::url($about->image_path);
        }

        return response()->json($about);
    }

    public function destroyAbout(About $about) 
    {
        if ($about->image_path) {
            Storage::disk('public')->delete($about->image_path);
        }
        $about->delete();
        return response()->json(['message' => 'About item deleted successfully.'], 200);
    }

    public function indexAdvantages()
    {
        $advantages = CompanyAdvantage::orderBy('order', 'asc')
            ->orderBy('id', 'asc')
            ->get();
        return response()->json($advantages);
    }


    public function storeAdvantage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:company_advantages,title',
            'title_id' => 'required|string|max:255',
            'description' => 'required|string',
            'description_id' => 'required|string',
            'icon_name' => 'required|string|max:255',
            'order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $advantage = CompanyAdvantage::create($validator->validated());

        return response()->json($advantage, 201);
    }

    public function updateAdvantage(Request $request, CompanyAdvantage $advantage)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:company_advantages,title,' . $advantage->id,
            'title_id' => 'required|string|max:255',
            'description' => 'required|string',
            'description_id' => 'required|string',
            'icon_name' => 'required|string|max:255',
            'order' => 'required|integer',
            '_method' => 'sometimes|required|in:PUT',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $advantage->update($validator->validated());

        return response()->json($advantage);
    }

    public function showAdvantage(CompanyAdvantage $advantage) 
    {
        return response()->json($advantage);
    }

    public function destroyAdvantage(CompanyAdvantage $advantage)
    {
        $advantage->delete();
        return response()->json(['message' => 'Advantage item deleted successfully.'], 200);
    }
}