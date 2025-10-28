import React, { useState, ChangeEvent, FormEvent } from "react";
import PageContent from "@/Components/ui/PageContent";
import { usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import InputField from "@/Components/common/InputField";
import PasswordField from "@/Components/common/PasswordField";
import axios from "axios";
import Button from "@/Components/ui/Button";

interface User {
    name: string;
    email: string;
    role: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface FormData {
    name: string;
    email: string;
    current_password: string;
    password: string;
    password_confirmation: string;
}

type ErrorMessages = Record<string, string[] | null>;

interface ValidationErrorResponse {
    message: string;
    errors: ErrorMessages;
}

interface SuccessResponse {
    message: string;
    user: User;
}

const getInitials = (name: string | null | undefined): string => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
};

const AccountSettingsPage: React.FC = () => {
    const { auth } = usePage<PageProps>().props;
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Pengaturan Akun", href: "/account/settings" },
    ];

    const [formData, setFormData] = useState<FormData>({
        name: auth.user.name || "",
        email: auth.user.email || "",
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState<ErrorMessages>({});
    const [processing, setProcessing] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof ErrorMessages]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.put<SuccessResponse>(
                "/api/account/settings",
                formData
            );
            toast.success(
                response.data.message || "Pengaturan akun berhasil diperbarui."
            );

            setFormData((prev) => ({
                ...prev,
                name: response.data.user.name,
                current_password: "",
                password: "",
                password_confirmation: "",
            }));
        } catch (error) {
            if (
                axios.isAxiosError<ValidationErrorResponse>(error) &&
                error.response?.status === 422 &&
                error.response?.data?.errors
            ) {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message || "Data tidak valid.");
            } else if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Gagal memperbarui akun."
                );
            } else {
                toast.error("Terjadi kesalahan yang tidak diketahui.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <PageContent
            breadcrumbItems={breadcrumbItems}
            pageTitle="Pengaturan Akun"
            pageClassName="mt-4"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                        {getInitials(formData.name)}
                    </div>
                    <h3 className="text-md md:text-lg font-medium text-neutral-700">
                        {formData.name}
                    </h3>
                    <p className="text-sm md:text-md text-neutral-500 capitalize">
                        {auth.user.role.replace("_", " ")}
                    </p>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-md font-medium text-neutral-700 mb-4 border-b pb-2">
                            Profil
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                id="name"
                                name="name"
                                label="Nama"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name ? errors.name[0] : undefined}
                            />
                            <InputField
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                disabled={true}
                                readOnly
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-md font-medium text-neutral-700 mb-4 border-b pb-2">
                            Ubah Password
                        </h3>
                        <div className="space-y-4">
                            <PasswordField
                                id="current_password"
                                name="current_password"
                                label="Password Lama"
                                value={formData.current_password}
                                onChange={handleChange}
                                error={
                                    errors.current_password
                                        ? errors.current_password[0]
                                        : undefined
                                }
                                placeholder="Wajib diisi jika mengubah password"
                                autoComplete="current-password"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <PasswordField
                                    id="password"
                                    name="password"
                                    label="Password Baru"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={
                                        errors.password
                                            ? errors.password[0]
                                            : undefined
                                    }
                                    autoComplete="new-password"
                                />
                                <PasswordField
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    label="Konfirmasi Password Baru"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    error={
                                        errors.password
                                            ? errors.password[0]
                                            : undefined
                                    }
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <Button
                        as="link"
                        variant="outline"
                        href="/"
                        iconLeft={<ArrowLeft className="h-5 w-5" />}
                    >
                        Kembali
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                        iconLeft={
                            processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )
                        }
                    >
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </PageContent>
    );
};

export default AccountSettingsPage;
