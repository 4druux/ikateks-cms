<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; // Penting untuk CUD

class ProductController extends Controller
{
    // --- RUTE PUBLIK (UNTUK PENGUNJUNG) ---

    /**
     * [GET /api/product-categories]
     * Mengambil semua kategori untuk halaman utama produk.
     */
    public function indexCategories()
    {
        $categories = ProductCategory::query()
            ->select('id', 'title', 'slug', 'description', 'image_path')
            ->get();
            
        return response()->json($categories);
    }

    /**
     * [GET /api/product-categories/{slug}]
     * Mengambil detail satu kategori BESERTA produk di dalamnya.
     */
    public function showCategory($slug)
    {
        $category = ProductCategory::where('slug', $slug)
            ->with(['products' => function ($query) {
                // Hanya pilih kolom yang diperlukan untuk daftar produk
                $query->select('id', 'product_category_id', 'name', 'slug', 'description', 'image_path');
            }])
            ->firstOrFail();
            
        return response()->json($category);
    }

    /**
     * [GET /api/products/{categorySlug}/{productSlug}]
     * Mengambil detail satu produk BESERTA kategori dan produk terkait.
     */
    public function showProduct($categorySlug, $productSlug)
    {
        $product = Product::where('slug', $productSlug)
            ->with(['productCategory' => function ($query) use ($categorySlug) {
                // Pastikan kategori-nya cocok
                $query->where('slug', $categorySlug);
            }])
            ->firstOrFail();

        // Cek jika produk tidak ditemukan di bawah kategori itu
        if (!$product->productCategory) {
            return response()->json(['message' => 'Product not found in this category'], 404);
        }

        // Ambil produk terkait
        $relatedProducts = Product::where('product_category_id', $product->product_category_id)
            ->where('id', '!=', $product->id) // Kecualikan produk ini
            ->select('id', 'name', 'slug', 'description', 'image_path')
            ->limit(3)
            ->get();

        return response()->json([
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }


    // --- RUTE ADMIN (UNTUK CRUD - DIAMANKAN DENGAN SANCTUM) ---

    /**
     * [POST /api/admin/categories]
     * Menyimpan kategori baru.
     */
    public function storeCategory(Request $request)
    {
        // Logika validasi dan penyimpanan
        // $validated = $request->validate([...]);
        // $category = ProductCategory::create($validated);
        // return response()->json($category, 201);
        
        return response()->json(['message' => 'Store category logic goes here (admin)']);
    }

    /**
     * [PUT /api/admin/categories/{id}]
     * Update kategori.
     */
    public function updateCategory(Request $request, $id)
    {
        // Logika validasi dan update
        // $category = ProductCategory::findOrFail($id);
        // $validated = $request->validate([...]);
        // $category->update($validated);
        // return response()->json($category);

        return response()->json(['message' => "Update category {$id} logic goes here (admin)"]);
    }
    
}