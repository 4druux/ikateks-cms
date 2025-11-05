import axios from "axios";

export interface NewsItem {
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

export const createNews = async (formData: FormData): Promise<NewsItem> => {
    const response = await axios.post("/api/admin/news", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getNewsBySlug = async (slug: string): Promise<NewsItem> => {
    const response = await axios.get(`/api/admin/news/${slug}`);
    return response.data;
};

export const updateNews = async (
    slug: string,
    formData: FormData
): Promise<NewsItem> => {
    formData.append("_method", "PUT");
    const response = await axios.post(`/api/admin/news/${slug}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteNews = async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/admin/news/${id}`);
    return response.data;
};
