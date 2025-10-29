import axios from "axios";

export interface Principal {
    id: number;
    image_path: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export const getAllPrincipals = async (): Promise<Principal[]> => {
    const response = await axios.get("/api/admin/principals");
    return response.data;
};

export const createPrincipal = async (
    formData: FormData
): Promise<Principal> => {
    const response = await axios.post("/api/admin/principals", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deletePrincipal = async (
    id: number
): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/admin/principals/${id}`);
    return response.data;
};
