import { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Globe, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();

    const [isVisible, setIsVisible] = useState(true);
    const [isTop, setIsTop] = useState(true);
    const lastScrollY = useRef(0);

    const navLinks = [
        { name: t("nav.home"), path: "/" },
        { name: t("nav.about"), path: "/about" },
        { name: t("nav.products"), path: "/products" },
        { name: t("nav.principals"), path: "/principals" },
        { name: t("nav.news"), path: "/news" },
        { name: t("nav.customers"), path: "/customers" },
    ];

    const isActive = (path: string) => url === path;

    const changeLanguage = (lng: "en" | "id") => {
        i18n.changeLanguage(lng);
    };

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            const TOP_THRESHOLD = 100;
            const HIDE_THRESHOLD = 10;

            if (currentScrollY <= TOP_THRESHOLD) {
                setIsTop(true);
            } else {
                setIsTop(false);
            }

            if (currentScrollY > HIDE_THRESHOLD) {
                if (currentScrollY > lastScrollY.current) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        if (!isOpen) {
            window.addEventListener("scroll", controlNavbar);
        }

        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <nav
                className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${
                    isVisible || isOpen ? "translate-y-0" : "-translate-y-full"
                } ${
                    isTop && !isOpen
                        ? "bg-transparent mt-2"
                        : "bg-white shadow-md"
                } ${
                    isOpen
                        ? "bg-white border-b border-zinc-200 shadow-none"
                        : "border-none"
                }`}
            >
                <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
                    <div className="flex justify-between items-center py-2 md:py-3">
                        <div className="flex-shrink-0">
                            <Link href="/" className="">
                                <img
                                    src={
                                        isTop && !isOpen
                                            ? "/images/icp-white.png"
                                            : "/images/icp.png"
                                    }
                                    alt="Logo"
                                    className="h-9 pr-20"
                                />
                            </Link>
                        </div>

                        <div className="hidden lg:flex flex-grow justify-center">
                            <div className="flex space-x-4 xl:space-x-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        href={link.path}
                                        className={`relative group px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                            isActive(link.path)
                                                ? isTop && !isOpen
                                                    ? "text-white"
                                                    : "text-red-700"
                                                : isTop && !isOpen
                                                ? "text-zinc-300 hover:text-white"
                                                : "text-zinc-700 hover:text-red-700"
                                        }`}
                                    >
                                        {link.name}
                                        <span
                                            className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1/2 h-[2px] transition duration-500 transform ${
                                                isTop && !isOpen
                                                    ? "bg-white"
                                                    : "bg-red-700"
                                            } ${
                                                isActive(link.path)
                                                    ? "scale-x-100"
                                                    : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="hidden lg:flex items-center space-x-4">
                                <div className="flex items-center text-sm font-medium">
                                    <Globe
                                        className={`w-5 h-5 mb-0.5 transition-colors duration-200 ${
                                            isTop && !isOpen
                                                ? "text-white"
                                                : "text-red-700"
                                        }`}
                                    />

                                    <button
                                        onClick={() => changeLanguage("en")}
                                        className={`px-2 transition-colors duration-200 ${
                                            i18n.language === "en"
                                                ? isTop && !isOpen
                                                    ? "text-white font-bold roboto-medium"
                                                    : "text-red-700 font-bold roboto-medium"
                                                : isTop && !isOpen
                                                ? "text-zinc-300 hover:text-white"
                                                : "text-zinc-500 hover:text-red-700"
                                        }`}
                                    >
                                        EN
                                    </button>
                                    <span
                                        className={
                                            isTop && !isOpen
                                                ? "text-zinc-400"
                                                : "text-zinc-300"
                                        }
                                    >
                                        |
                                    </span>
                                    <button
                                        onClick={() => changeLanguage("id")}
                                        className={`px-2 transition-colors duration-200 ${
                                            i18n.language === "id"
                                                ? isTop && !isOpen
                                                    ? "text-white font-bold roboto-medium"
                                                    : "text-red-700 font-bold roboto-medium"
                                                : isTop && !isOpen
                                                ? "text-zinc-300 hover:text-white"
                                                : "text-zinc-500 hover:text-red-700"
                                        }`}
                                    >
                                        ID
                                    </button>
                                </div>

                                <Link
                                    href="/contact"
                                    className={`px-4 py-2 text-sm font-medium border transition-colors duration-300 ${
                                        isTop && !isOpen
                                            ? "text-white hover:bg-red-900/50"
                                            : "bg-red-800 text-white hover:bg-white hover:text-red-700"
                                    } hover:border-red-800`}
                                >
                                    {t("nav.contact")}
                                </Link>
                            </div>

                            <div className="lg:hidden ml-4">
                                <div className="flex items-center">
                                    <Globe
                                        className={`w-5 h-5 mb-0.5 transition-colors duration-200 ${
                                            isTop && !isOpen
                                                ? "text-white"
                                                : "text-red-700"
                                        }`}
                                    />

                                    <div className="flex items-center text-sm font-medium">
                                        <button
                                            onClick={() => changeLanguage("en")}
                                            className={`px-1 transition-colors duration-200 ${
                                                i18n.language === "en"
                                                    ? isTop && !isOpen
                                                        ? "text-white font-bold roboto-medium"
                                                        : "text-red-700 font-bold roboto-medium"
                                                    : isTop && !isOpen
                                                    ? "text-zinc-300"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            EN
                                        </button>
                                        <span
                                            className={
                                                isTop && !isOpen
                                                    ? "text-zinc-400"
                                                    : "text-zinc-300"
                                            }
                                        >
                                            |
                                        </span>
                                        <button
                                            onClick={() => changeLanguage("id")}
                                            className={`px-1 transition-colors duration-200 ${
                                                i18n.language === "id"
                                                    ? isTop && !isOpen
                                                        ? "text-white font-bold roboto-medium"
                                                        : "text-red-700 font-bold roboto-medium"
                                                    : isTop && !isOpen
                                                    ? "text-zinc-300"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            ID
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="p-2 rounded-md"
                                        aria-label="Toggle menu"
                                    >
                                        {isOpen ? (
                                            <X className="h-6 w-6 text-zinc-700" />
                                        ) : (
                                            <Menu
                                                className={`h-6 w-6 ${
                                                    isTop
                                                        ? "text-white"
                                                        : "text-zinc-700"
                                                }`}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                } bg-white px-4 sm:px-6 lg:px-8 py-4 flex flex-col`}
            >
                <div className="pt-20">
                    <div className="space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block rounded-md px-4 py-3 text-lg font-medium transition-colors duration-200 ${
                                    isActive(link.path)
                                        ? "bg-red-50 text-red-700"
                                        : "text-zinc-700 hover:bg-zinc-50 hover:text-red-700"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pb-4">
                    <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="block w-full bg-red-900 px-4 py-3 text-center text-lg font-medium text-white transition-colors duration-300 hover:bg-white hover:text-red-900 border border-red-800"
                    >
                        {t("nav.contact")}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;
