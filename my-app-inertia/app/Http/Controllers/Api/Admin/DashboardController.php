<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\News;
use App\Models\Principals;
use App\Models\Product;
use App\Models\ProductCategory;

class DashboardController extends Controller
{
    public function getStats()
    {
        $categoryCount = ProductCategory::count();
        $productCount = Product::count();
        $newsCount = News::count();
        $customerCount = Customers::count();
        $principalCount = Principals::count();

        return response()->json([
            'categoryCount' => $categoryCount,
            'productCount' => $productCount,
            'newsCount' => $newsCount,
            'customerCount' => $customerCount,
            'principalCount' => $principalCount,
        ]);
    }
}