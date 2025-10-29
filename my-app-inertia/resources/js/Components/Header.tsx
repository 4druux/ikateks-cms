import { Menu, Settings, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDropdown, dropdownAnimation } from "@/Hooks/use-dropdown";
import { usePage, Link } from "@inertiajs/react";
import React, { useState } from "react";
import DotLoader from "./ui/DotLoader";
import toast from "react-hot-toast";
import axios from "axios";

interface User {
    name: string;
    role: string | null;
}

interface PageProps {
    auth: {
        user: User | null;
    };
    [key: string]: any;
}

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { isOpen, setIsOpen, dropdownRef } = useDropdown<HTMLDivElement>();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const { auth } = usePage<PageProps>().props;

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsOpen(false);
        setIsLoggingOut(true);

        const logoutPromise = axios.post("/api/logout");

        toast.promise(logoutPromise, {
            loading: "Sedang keluar...",
            success: () => {
                window.location.href = "/login";
                return "Anda berhasil keluar.";
            },
            error: (err: any) => {
                console.error("Logout failed:", err);
                window.location.href = "/login";
                return "Gagal keluar, coba lagi.";
            },
        });
    };

    const getInitials = (name: string | null | undefined): string => {
        if (!name) return "";
        const names = name.split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (
            names[0].charAt(0) + names[names.length - 1].charAt(0)
        ).toUpperCase();
    };

    const formatRoleName = (role: string | null | undefined): string => {
        if (!role) return "";
        return role
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <>
            {isLoggingOut && (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-[999]">
                    <DotLoader />
                </div>
            )}

            <header className="lg:py-3 lg:px-6 text-zinc-700 sticky top-0 z-30">
                <div className="flex items-center justify-between bg-white lg:border border-zinc-300 rounded-lg lg:shadow-sm py-3 lg:px-4">
                    <div className="flex items-center gap-2 pl-3 sm:pl-0">
                        <img
                            src="/images/icp.png"
                            alt="Logo ICP"
                            className="w-10 md:w-14 object-cover"
                        />

                        <hr className="w-px h-8 bg-zinc-300 ml-1" />
                        <div className="flex items-center">
                            <button
                                onClick={onMenuClick}
                                className="p-2 rounded-full hover:bg-zinc-100 focus:outline-none cursor-pointer"
                                aria-label="Toggle Menu"
                            >
                                <Menu className="w-4 h-4" />
                            </button>

                            <a
                                href="/admin"
                                className="text-sm uppercase hover:bg-zinc-100 p-0 sm:p-2 rounded-lg"
                            >
                                dashboard
                            </a>
                        </div>
                    </div>

                    {auth.user ? (
                        <div
                            ref={dropdownRef}
                            className="relative flex items-center pr-3"
                        >
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-10 h-10 rounded-full bg-red-900 border text-white flex items-center justify-center font-bold text-sm md:text-md hover:bg-red-900/90 focus:outline-none cursor-pointer"
                                aria-label="User Profile"
                            >
                                {getInitials(auth.user.name)}
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={dropdownAnimation.variants}
                                        transition={
                                            dropdownAnimation.transition
                                        }
                                        className="absolute top-full right-3 mt-2 w-56 bg-white rounded-lg shadow-lg border border-zinc-200"
                                    >
                                        <div
                                            className="p-2"
                                            role="menu"
                                            aria-orientation="vertical"
                                        >
                                            <div className="px-4 py-2 text-sm text-zinc-800 border-b border-zinc-100 mb-1">
                                                <div className="mb-1">
                                                    Halo! {auth.user.name}
                                                </div>
                                                <div className="text-xs text-zinc-500">
                                                    {formatRoleName(
                                                        auth.user.role
                                                    )}
                                                </div>
                                            </div>
                                            <Link
                                                href="/admin/account-settings"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md"
                                                role="menuitem"
                                            >
                                                <Settings className="w-4 h-4 text-zinc-500" />
                                                <span>Account Settings</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                                                role="menuitem"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : null}
                </div>
            </header>
        </>
    );
};

export default Header;
