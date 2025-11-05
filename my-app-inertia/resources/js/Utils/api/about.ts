import axios from "axios";

export interface AboutItem {
    id: number;
    title: string;
    description: string;
    title_id: string;
    description_id: string;
    image_path: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export const createAbout = async (formData: FormData): Promise<AboutItem> => {
    const response = await axios.post("/api/admin/about", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getAboutById = async (id: number): Promise<AboutItem> => {
    const response = await axios.get(`/api/admin/about/${id}`);
    return response.data;
};

export const updateAbout = async (
    id: number,
    formData: FormData
): Promise<AboutItem> => {
    formData.append("_method", "PUT");
    const response = await axios.post(`/api/admin/about/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteAbout = async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/admin/about/${id}`);
    return response.data;
};
