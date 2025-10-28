import axios from "axios";

export interface ResetPasswordData {
    password: string;
    password_confirmation: string;
}

export const approveUser = async (userId: string | number) => {
    const response = await axios.post(`/api/users/${userId}/approve`);
    return response.data;
};

export const rejectUser = async (userId: string | number) => {
    const response = await axios.delete(`/api/users/${userId}`);
    return response.data;
};

export const resetPassword = async (
    userId: string | number,
    passwordData: ResetPasswordData
) => {
    const response = await axios.put(
        `/api/users/${userId}/reset-password`,
        passwordData
    );
    return response.data;
};
