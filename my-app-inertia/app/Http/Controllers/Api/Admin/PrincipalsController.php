<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Principals;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PrincipalsController extends Controller
{

    public function index()
    {
        $principals = Principals::latest()->get();
        $principals->each(function ($principal) {
            if ($principal->image_path) {
                $principal->image_url = Storage::url($principal->image_path);
            }
        });
        return response()->json($principals);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('principals', 'public');
        }

        $principal = Principals::create(['image_path' => $imagePath]);

        if ($principal->image_path) {
            $principal->image_url = Storage::url($principal->image_path);
        }

        return response()->json($principal, 201);
    }


    public function destroy(Principals $principal)
    {
        if ($principal->image_path) {
            Storage::disk('public')->delete($principal->image_path);
        }

        $principal->delete();

        return response()->json(['message' => 'Principals logo deleted successfully.'], 200);
    }
}