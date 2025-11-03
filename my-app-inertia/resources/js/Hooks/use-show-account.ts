import React, { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { fetcher, approveUser, rejectUser, resetPassword } from "@/Utils/api";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    approved_at: string | null;
}

interface UseShowAccountReturn {
    users: User[] | undefined;
    isLoading: boolean;
    error: any;
    pendingUsers: User[];
    approvedUsers: User[];
    isProcessing: boolean;
    isModalOpen: boolean;
    selectedUser: User | null;
    searchTerm: string;
    handleApprove: (userId: number) => Promise<void>;
    handleReject: (userId: number) => Promise<void>;
    handleResetPassword: (
        user: User,
        newPass: string,
        confirmPass: string
    ) => Promise<void>;
    handleOpenModal: (user: User) => void;
    handleCloseModal: () => void;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearSearch: () => void;
}

export const useShowAccount = (role: string | null): UseShowAccountReturn => {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] =
        useState<string>(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    const swrKey = role
        ? `/api/admin/users?role=${role}&search=${debouncedSearchTerm}`
        : null;

    const { data: users, error, mutate } = useSWR<User[]>(swrKey, fetcher);

    const pendingUsers = useMemo<User[]>(
        () => (users || []).filter((user) => !user.approved_at),
        [users]
    );

    const approvedUsers = useMemo<User[]>(
        () => (users || []).filter((user) => user.approved_at),
        [users]
    );

    const handleApprove = async (userId: number) => {
        setIsProcessing(true);
        const toastId = toast.loading("Approving user...");
        try {
            const response = await approveUser(userId);
            toast.success(response.message, { id: toastId });
            mutate();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to approve user.",
                { id: toastId }
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (userId: number) => {
        const action = users?.find((u) => u.id === userId)?.approved_at
            ? "delete"
            : "reject";
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        setIsProcessing(true);
        const toastId = toast.loading("Processing request...");
        try {
            const response = await rejectUser(userId);
            toast.success(response.message, { id: toastId });
            mutate();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || `Failed to ${action} user.`,
                { id: toastId }
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleResetPassword = async (
        user: User,
        newPassword: string,
        passwordConfirmation: string
    ) => {
        const toastId = toast.loading("Resetting password...");
        try {
            const response = await resetPassword(user.id, {
                password: newPassword,
                password_confirmation: passwordConfirmation,
            });
            toast.success(response.message, { id: toastId });
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to reset password.",
                { id: toastId }
            );
            throw error;
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleOpenModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    return {
        users,
        isLoading: !error && !users,
        error,
        pendingUsers,
        approvedUsers,
        isProcessing,
        isModalOpen,
        selectedUser,
        searchTerm,
        handleApprove,
        handleReject,
        handleResetPassword,
        handleOpenModal,
        handleCloseModal,
        handleSearchChange,
        handleClearSearch,
    };
};
