import axios from "axios";

export interface Customer {
    id: number;
    image_path: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export const getAllCustomers = async (): Promise<Customer[]> => {
    const response = await axios.get("/api/admin/customers");
    return response.data;
};

export const createCustomer = async (formData: FormData): Promise<Customer> => {
    const response = await axios.post("/api/admin/customers", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteCustomer = async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/admin/customers/${id}`);
    return response.data;
};