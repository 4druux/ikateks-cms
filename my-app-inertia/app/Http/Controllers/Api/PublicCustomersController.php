<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use Illuminate\Support\Facades\Storage;

class PublicCustomersController extends Controller
{

    public function index()
    {
        $customers = Customers::oldest()->get();
        $customers->each(function ($customer) {
            if ($customer->image_path) {
                $customer->image_url = Storage::url($customer->image_path);
            }
        });
        return response()->json($customers);
    }
}