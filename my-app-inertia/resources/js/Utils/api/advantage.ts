import axios from "axios";

export interface AdvantageItem {
    id: number;
    title: string;
    title_id: string;
    description: string;
    description_id: string;
    icon_name: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export const createAdvantage = async (
    formData: FormData
): Promise<AdvantageItem> => {
    const response = await axios.post(
        "/api/admin/company-advantages",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const getAdvantageById = async (id: number): Promise<AdvantageItem> => {
    const response = await axios.get(`/api/admin/company-advantages/${id}`);
    return response.data;
};

export const updateAdvantage = async (
    id: number,
    formData: FormData
): Promise<AdvantageItem> => {
    formData.append("_method", "PUT");
    const response = await axios.post(
        `/api/admin/company-advantages/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const deleteAdvantage = async (
    id: number
): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/admin/company-advantages/${id}`);
    return response.data;
};
