import axios from "axios";

export interface Category {
    id: number;
    title: string;
    description: string;
    title_id: string;
    description_id: string;
    image_path: string;
    image_url?: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    product_category_id: number;
    name: string;
    description: string;
    name_id: string;
    description_id: string;
    image_path: string;
    image_url?: string;
    slug: string;
    created_at: string;
    updated_at: string;
    category?: Category;
}

export const getAllCategories = async () => {
    const response = await axios.get("/api/admin/categories");
    return response.data;
};

export const createCategory = async (formData: FormData) => {
    const response = await axios.post("/api/admin/categories", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getCategoryBySlug = async (slug: string) => {
    const response = await axios.get(`/api/admin/categories/${slug}`);
    return response.data;
};

export const updateCategory = async (slug: string, formData: FormData) => {
    formData.append("_method", "PUT");
    const response = await axios.post(
        `/api/admin/categories/${slug}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const deleteCategory = async (id: number) => {
    const response = await axios.delete(`/api/admin/categories/${id}`);
    return response.data;
};

export const getAllProducts = async (categoryId?: number) => {
    let url = "/api/admin/products";
    if (categoryId) {
        url += `?category_id=${categoryId}`;
    }
    const response = await axios.get(url);
    return response.data;
};

export const createProduct = async (formData: FormData) => {
    const response = await axios.post("/api/admin/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getProductBySlug = async (slug: string) => {
    const response = await axios.get(`/api/admin/products/${slug}`);
    return response.data;
};

export const updateProduct = async (slug: string, formData: FormData) => {
    formData.append("_method", "PUT");
    const response = await axios.post(`/api/admin/products/${slug}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteProduct = async (id: number) => {
    const response = await axios.delete(`/api/admin/products/${id}`);
    return response.data;
};
