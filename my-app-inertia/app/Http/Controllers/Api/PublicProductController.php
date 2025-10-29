<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Support\Facades\Storage;

class PublicProductController extends Controller
{
    public function indexCategories()
    {
        $categories = ProductCategory::latest()->get();
        $categories->each(function ($category) {
            if ($category->image_path) {
                $category->image_url = Storage::url($category->image_path);
            }
        });

        return response()->json($categories);
    }

    public function indexProducts(ProductCategory $category)
    {
        $products = $category->products()->latest()->get();
        $products->each(function ($product) {
            if ($product->image_path) {
                $product->image_url = Storage::url($product->image_path);
            }
        });

        if ($category->image_path) {
            $category->image_url = Storage::url($category->image_path);
        }

        return response()->json([
            'category' => $category,
            'products' => $products
        ]);
    }

    public function showProduct(Product $product)
    {
        if ($product->image_path) {
            $product->image_url = Storage::url($product->image_path);
        }

        $category = $product->productCategory;
        if ($category && $category->image_path) {
            $category->image_url = Storage::url($category->image_path);
        }

        $relatedProducts = $category ? $category->products()
                            ->where('id', '!=', $product->id)
                            ->latest()
                            ->get() : collect(); 

        $relatedProducts->each(function ($relatedProduct) {
            if ($relatedProduct->image_path) {
                $relatedProduct->image_url = Storage::url($relatedProduct->image_path);
            }
        });


        return response()->json([
            'product' => $product,
            'category' => $category,
            'relatedProducts' => $relatedProducts
        ]);
    }
}