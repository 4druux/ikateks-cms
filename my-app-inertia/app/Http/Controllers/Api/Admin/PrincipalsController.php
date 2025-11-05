<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Principals;
use App\Models\PrincipalsLogo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PrincipalsController extends Controller
{
    public function index()
    {
        $principals = Principals::orderBy('order', 'asc')
            ->orderBy('id', 'asc')
            ->get();
        return response()->json($principals);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:principals,title',
            'title_id' => 'required|string|max:255',
            'description' => 'required|string',
            'description_id' => 'required|string',
            'icon_name' => 'required|string|max:255',
            'methodology' => 'required|json',
            'methodology_id' => 'required|json',
            'order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $principal = Principals::create($validator->validated());

        return response()->json($principal, 201);
    }

    public function update(Request $request, Principals $principal)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:principals,title,' . $principal->id,
            'title_id' => 'required|string|max:255',
            'description' => 'required|string',
            'description_id' => 'required|string',
            'icon_name' => 'required|string|max:255',
            'methodology' => 'required|json',
            'methodology_id' => 'required|json',
            'order' => 'required|integer',
            '_method' => 'sometimes|required|in:PUT',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $principal->update($validator->validated());

        return response()->json($principal);
    }

    public function show(Principals $principal) 
    {
        return response()->json($principal);
    }

    public function destroy(Principals $principal)
    {
        $principal->delete();
        return response()->json(['message' => 'Principals item deleted successfully.'], 200);
    }

    public function indexLogo()
    {
        $principals = PrincipalsLogo::oldest()->get();
        $principals->each(function ($principal) {
            if ($principal->image_path) {
                $principal->image_url = Storage::url($principal->image_path);
            }
        });
        return response()->json($principals);
    }


    public function storeLogo(Request $request)
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

        $principal = PrincipalsLogo::create(['image_path' => $imagePath]);

        if ($principal->image_path) {
            $principal->image_url = Storage::url($principal->image_path);
        }

        return response()->json($principal, 201);
    }


    public function destroyLogo(PrincipalsLogo $principal)
    {
        if ($principal->image_path) {
            Storage::disk('public')->delete($principal->image_path);
        }

        $principal->delete();

        return response()->json(['message' => 'Principals logo deleted successfully.'], 200);
    }
}