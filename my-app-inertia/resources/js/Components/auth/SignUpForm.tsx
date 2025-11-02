import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { router, Link } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Loader2, LogIn } from "lucide-react";
import InputField from "@/Components/common/InputField";
import PasswordField from "@/Components/common/PasswordField";
import Button from "@/Components/common/Button";

type ErrorMessages = Record<string, string[]>;

interface ValidationErrorResponse {
    message: string;
    errors: ErrorMessages;
}

export default function SignUpForm() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });
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
            const response = await axios.post("/api/register", values);
            toast.success(response.data.message);

            router.visit("/login");
        } catch (error) {
            if (
                axios.isAxiosError<ValidationErrorResponse>(error) &&
                error.response?.status === 422
            ) {
                setErrors(error.response.data.errors);
                toast.error("Fail to register, please try again.");
            } else if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                        "An error occurred on the server."
                );
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md px-4 md:px-0">
            <div className="flex flex-col items-start">
                <h1 className="mt-4 text-3xl text-zinc-900">Welcome! 👋</h1>
                <p className="mt-1 text-sm text-zinc-500">
                    Please register your account, and start using the app.
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                <InputField
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name ? errors.name[0] : undefined}
                    required
                />
                <InputField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
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
                <PasswordField
                    id="password_confirmation"
                    name="password_confirmation"
                    label="Confirm Password"
                    value={values.password_confirmation}
                    onChange={handleChange}
                    error={
                        errors.password_confirmation
                            ? errors.password_confirmation[0]
                            : undefined
                    }
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
                        {isSubmitting ? "Loading..." : "Sign Up"}
                    </Button>
                </div>
            </form>
            <h1 className="mt-4 text-sm text-zinc-700">
                Already have an account?{" "}
                <Link href="/login" className="text-red-900 hover:underline">
                    Login
                </Link>
            </h1>
        </div>
    );
}
