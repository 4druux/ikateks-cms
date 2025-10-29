<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CustomersController extends Controller
{
    public function index()
    {
        $customers = Customers::latest()->get();
        $customers->each(function ($customer) {
            if ($customer->image_path) {
                $customer->image_url = Storage::url($customer->image_path);
            }
        });
        return response()->json($customers);
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
            $imagePath = $request->file('image')->store('customers', 'public');
        }

        $customer = Customers::create(['image_path' => $imagePath]);

        if ($customer->image_path) {
            $customer->image_url = Storage::url($customer->image_path);
        }

        return response()->json($customer, 201);
    }


    public function destroy(Customers $customer)
    {
        if ($customer->image_path) {
            Storage::disk('public')->delete($customer->image_path);
        }

        $customer->delete();

        return response()->json(['message' => 'Customers logo deleted successfully.'], 200);
    }
}