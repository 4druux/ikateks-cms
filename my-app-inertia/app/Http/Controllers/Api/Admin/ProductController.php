<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\SubProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function indexCategories()
    {
        $categories = ProductCategory::oldest()->get();
        $categories->each(function ($category) {
            if ($category->image_path) {
                $category->image_url = Storage::url($category->image_path);
            }
        });

        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:product_categories,title',
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
            $imagePath = $request->file('image')->store('categories', 'public');
            $dataToCreate['image_path'] = $imagePath;
        }

        $category = ProductCategory::create($dataToCreate);

        if ($category->image_path) {
            $category->image_url = Storage::url($category->image_path);
        }
        return response()->json($category, 201);
    }

    public function showCategory(ProductCategory $category)
    {
        if ($category->image_path) {
            $category->image_url = Storage::url($category->image_path);
        }
        return response()->json($category);
    }

    public function updateCategory(Request $request, ProductCategory $category)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:product_categories,title,' . $category->id,
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

        if ($request->filled('title') && $category->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        } else {
            unset($validated['title']);
        }

        if ($request->hasFile('image')) {
            if ($category->image_path) {
                Storage::disk('public')->delete($category->image_path);
            }
            $imagePath = $request->file('image')->store('categories', 'public');
            $validated['image_path'] = $imagePath;
            unset($validated['image']);
        } else {
            unset($validated['image']);
        }

        $category->update($validated);
        $category->refresh();

        if ($category->image_path) {
            $category->image_url = Storage::url($category->image_path);
        }
        return response()->json($category);
    }

    public function destroyCategory(ProductCategory $category)
    {
        if ($category->image_path) {
            Storage::disk('public')->delete($category->image_path);
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully.'], 200);
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

    public function storeProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string',
            'name_id' => 'required|string|max:255',
            'description_id' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'product_category_id' => 'required|integer|exists:product_categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $dataToCreate = [
            'name' => $validatedData['name'],
            'product_category_id' => $validatedData['product_category_id'],
            'description' => $validatedData['description'],
            'name_id' => $validatedData['name_id'],
            'description_id' => $validatedData['description_id'],
            'slug' => Str::slug($validatedData['name']),
            'image_path' => null,
        ];

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $dataToCreate['image_path'] = $imagePath;
        }

        $product = Product::create($dataToCreate);

        if ($product->image_path) {
            $product->image_url = Storage::url($product->image_path);
        }
        return response()->json($product, 201);
    }

    public function showProduct(Product $product)
    {
        if ($product->image_path) {
            $product->image_url = Storage::url($product->image_path);
        }

        $product->load(['subProducts' => function ($query) {
            $query->oldest();
        }]);

        $product->subProducts->each(function ($subProduct) {
            if ($subProduct->image_path) {
                $subProduct->image_url = Storage::url($subProduct->image_path);
            }
        });

        return response()->json($product);
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                 Rule::unique('products', 'name')->ignore($product->id),
            ],
            'description' => 'required|string',
            'name_id' => 'required|string|max:255',
            'description_id' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'product_category_id' => 'required|integer|exists:product_categories,id',
            '_method' => 'sometimes|required|in:PUT',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        if ($request->filled('name') && $product->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        } else {
            unset($validated['name']);
        }

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image_path'] = $imagePath;
            unset($validated['image']);
        } else {
            unset($validated['image']);
        }

        $product->update($validated);
        $product->refresh();

        if ($product->image_path) {
            $product->image_url = Storage::url($product->image_path);
        }
        return response()->json($product);
    }

    public function destroyProduct(Product $product)
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully.'], 200);
    }

    public function indexSubProducts(Product $product)
    {
        $subProducts = $product->subProducts()->oldest()->get();
        $subProducts->each(function ($subProduct) {
            if ($subProduct->image_path) {
                $subProduct->image_url = Storage::url($subProduct->image_path);
            }
        });

        if ($product->image_path) {
            $product->image_url = Storage::url($product->image_path);
        }

        return response()->json([
            'product' => $product,
            'subProducts' => $subProducts
        ]);
    }

    public function storeSubProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:sub_products,name',
            'description' => 'required|string',
            'name_id' => 'required|string|max:255',
            'description_id' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'product_id' => 'required|integer|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $dataToCreate = [
            'name' => $validatedData['name'],
            'product_id' => $validatedData['product_id'],
            'description' => $validatedData['description'],
            'name_id' => $validatedData['name_id'],
            'description_id' => $validatedData['description_id'],
            'slug' => Str::slug($validatedData['name']),
            'image_path' => null,
        ];

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('subproducts', 'public');
            $dataToCreate['image_path'] = $imagePath;
        }

        $subProduct = SubProduct::create($dataToCreate);

        if ($subProduct->image_path) {
            $subProduct->image_url = Storage::url($subProduct->image_path);
        }
        return response()->json($subProduct, 201);
    }

    public function showSubProduct(SubProduct $subProduct)
    {
        if ($subProduct->image_path) {
            $subProduct->image_url = Storage::url($subProduct->image_path);
        }
        return response()->json($subProduct);
    }

    public function updateSubProduct(Request $request, SubProduct $subProduct)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sub_products', 'name')->ignore($subProduct->id),
            ],
            'description' => 'required|string',
            'name_id' => 'required|string|max:255',
            'description_id' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'product_id' => 'required|integer|exists:products,id',
            '_method' => 'sometimes|required|in:PUT',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        if ($request->filled('name') && $subProduct->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        } else {
            unset($validated['name']);
        }

        if ($request->hasFile('image')) {
            if ($subProduct->image_path) {
                Storage::disk('public')->delete($subProduct->image_path);
            }
            $imagePath = $request->file('image')->store('subproducts', 'public');
            $validated['image_path'] = $imagePath;
            unset($validated['image']);
        } else {
            unset($validated['image']);
        }

        $subProduct->update($validated);
        $subProduct->refresh();

        if ($subProduct->image_path) {
            $subProduct->image_url = Storage::url($subProduct->image_path);
        }
        return response()->json($subProduct);
    }

    public function destroySubProduct(SubProduct $subProduct)
    {
        if ($subProduct->image_path) {
            Storage::disk('public')->delete($subProduct->image_path);
        }
        $subProduct->delete();
        return response()->json(['message' => 'Sub-product deleted successfully.'], 200);
    }
}