import axios from "axios";

export interface ResetPasswordData {
    password: string;
    password_confirmation: string;
}

export const approveUser = async (userId: string | number) => {
    const response = await axios.post(`/api/admin/users/${userId}/approve`);
    return response.data;
};

export const rejectUser = async (userId: string | number) => {
    const response = await axios.delete(`/api/admin/users/${userId}`);
    return response.data;
};

export const resetPassword = async (
    userId: string | number,
    passwordData: ResetPasswordData
) => {
    const response = await axios.put(
        `/api/admin/users/${userId}/reset-password`,
        passwordData
    );
    return response.data;
};
