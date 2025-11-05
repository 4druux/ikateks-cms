import axios from "axios";

export interface PrincipalItem {
    id: number;
    title: string;
    title_id: string;
    description: string;
    description_id: string;
    icon_name: string;
    methodology: string;
    methodology_id: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface PrincipalLogo {
    id: number;
    image_path: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export const createPrincipals = async (
    formData: FormData
): Promise<PrincipalItem> => {
    const response = await axios.post(
        "/api/admin/principals",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const getPrincipalsById = async (id: number): Promise<PrincipalItem> => {
    const response = await axios.get(`/api/admin/principals/${id}`);
    return response.data;
};

export const updatePrincipals = async (
    id: number,
    formData: FormData
): Promise<PrincipalItem> => {
    formData.append("_method", "PUT");
    const response = await axios.post(
        `/api/admin/principals/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const deletePrincipals = async (
    id: number
): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/admin/principals/${id}`);
    return response.data;
};

export const createLogoPrincipal = async (
    formData: FormData
): Promise<PrincipalLogo> => {
    const response = await axios.post("/api/admin/principals/logo", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteLogoPrincipal = async (
    id: number
): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/admin/principals/logo/${id}`);
    return response.data;
};
