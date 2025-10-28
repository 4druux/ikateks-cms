import { Suspense } from "react";
import DotLoader from "@/Components/ui/DotLoader";
import Badge from "@/Components/auth/Badge";
import AuthHeader from "@/Components/auth/AuthHeader";
import SignInForm from "@/Components/auth/SignInForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 min-h-screen">
                <div className="hidden sm:flex sm:col-span-1 xl:col-span-2 items-center justify-center bg-zinc-50 p-12 relative overflow-hidden">
                    <Badge
                        imageSrc="./images/login.svg"
                        altText="Login Illustration"
                    />
                </div>

                <div className="flex items-center justify-center sm:col-span-1">
                    <AuthHeader />
                    <Suspense
                        fallback={
                            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                                <DotLoader />
                            </div>
                        }
                    >
                        <SignInForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

LoginPage.layout = null;
export default LoginPage;
