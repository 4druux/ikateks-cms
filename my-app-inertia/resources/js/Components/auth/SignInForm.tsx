import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { router, Link } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Loader2, LogIn } from "lucide-react";
import InputField from "@/Components/common/InputField";
import PasswordField from "@/Components/common/PasswordField";
import Button from "@/Components/ui/Button";

type ErrorMessages = Record<string, string[]>;

interface ValidationErrorResponse {
    message: string;
    errors: ErrorMessages;
}

export default function SignInForm() {
    const [values, setValues] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<ErrorMessages>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            await axios.post("/api/login", values);

            toast.success("Login berhasil!");
            router.visit("/");
        } catch (error) {
            const loginErrorMessage = "Email atau password salah.";

            if (
                axios.isAxiosError<ValidationErrorResponse>(error) &&
                error.response?.status === 422
            ) {
                const backendErrors = error.response.data.errors;

                if (
                    backendErrors.email &&
                    backendErrors.email[0] === loginErrorMessage
                ) {
                    setErrors({
                        email: [loginErrorMessage],
                        password: [loginErrorMessage],
                    });
                } else {
                    setErrors(backendErrors);
                }

                toast.error(error.response.data.message || loginErrorMessage);
            } else if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                        "Terjadi kesalahan pada server."
                );
            } else {
                toast.error("Terjadi kesalahan yang tidak diketahui.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md px-4 md:px-0">
            <div className="flex flex-col items-start">
                <h1 className="mt-4 text-3xl text-zinc-900">
                    Selamat Datang! 👋
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                    Silakan masuk ke akun Anda, dan mulai menggunakan aplikasi.
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                <InputField
                    id="email"
                    name="email"
                    label="Email"
                    type="text"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email ? errors.email[0] : undefined}
                    required
                />
                <PasswordField
                    id="password"
                    name="password"
                    label="Password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password ? errors.password[0] : undefined}
                    required
                />

                <div>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                        iconLeft={
                            isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <LogIn className="h-4 w-4" />
                            )
                        }
                    >
                        {isSubmitting ? "Memproses..." : "Masuk"}
                    </Button>
                </div>
            </form>
            <h1 className="mt-4 text-sm text-zinc-700">
                Tidak mempunyai akun?{" "}
                <Link href="/register" className="text-red-900 hover:underline">
                    Silahkan Daftar
                </Link>
            </h1>
        </div>
    );
}
