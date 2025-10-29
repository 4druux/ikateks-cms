import Lenis from "lenis";
import { useEffect, useState, ReactNode } from "react";
import Header from "@/Components/Header";
import Sidebar from "@/Components/Sidebar";
import { usePage, router } from "@inertiajs/react";
import DotLoader from "@/Components/ui/DotLoader";
import { LenisContext } from "@/Context/LenisContext";

interface User {
    [key: string]: any;
}

interface PageProps {
    auth: {
        user: User | null;
    };
    [key: string]: any;
}

interface AuthenticatedLayoutProps {
    children: ReactNode;
    title: string;
}

export default function AuthenticatedLayout({
    children,
}: AuthenticatedLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!auth.user) {
            router.visit("/login", { replace: true });
        }
    }, [auth]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const isMobile = window.innerWidth < 1024;
        if (isSidebarOpen && isMobile) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleNavigate = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        };

        const removeListener = router.on("navigate", handleNavigate);

        return () => {
            removeListener();
        };
    }, []);

    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenisInstance = new Lenis();
        setLenis(lenisInstance);

        function raf(time: number) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenisInstance.destroy();
            setLenis(null);
        };
    }, []);

    if (!auth.user) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    return (
        <LenisContext.Provider value={lenis}>
            <div className="min-h-screen bg-white lg:bg-zinc-50">
                <Header onMenuClick={toggleSidebar} />
                <div className="flex">
                    <Sidebar isOpen={isSidebarOpen} />
                    <button
                        onClick={toggleSidebar}
                        className={`
                        fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
                        ${
                            isSidebarOpen
                                ? "opacity-100 pointer-events-auto"
                                : "opacity-0 pointer-events-none"
                        }
                        lg:hidden
                    `}
                    />
                    <div
                        className={`min-w-0 w-full transition-all duration-300 ease-in-out ${
                            isSidebarOpen ? "lg:ml-72" : "lg:ml-0"
                        }`}
                    >
                        <main className="px-4 lg:px-6 mt-2">{children}</main>
                    </div>
                </div>
            </div>
        </LenisContext.Provider>
    );
}
